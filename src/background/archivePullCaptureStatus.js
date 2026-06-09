/**
 * perma-extension
 * @module background/archivePullCaptureStatus
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Handler for the `ARCHIVE_PULL_CAPTURE_STATUS` runtime message.
 */
// @ts-check

import { PermaAPI, PermaAPIError } from "@harvard-lil/perma-js-sdk";
import { Auth, Status } from "../storage/index.js";
import { archivePullTimeline } from "./archivePullTimeline.js";
import { PERMA_API_BASE_URL } from "../constants/index.js";

/**
 * Capture-job statuses that mean the capture is no longer running.
 * See `PermaCaptureJob.status` in `perma-js-sdk`.
 * @constant
 */
const TERMINAL_STATUSES = ["completed", "failed", "invalid", "deleted"];

/**
 * Handler for the `ARCHIVE_PULL_CAPTURE_STATUS` runtime message:
 * Pulls the capture-job status for the archive currently being captured (`status.captureGuid`)
 * and reflects its progress in storage.
 *
 * This is the lightweight, capture-scoped poll that replaces re-pulling the whole archive
 * timeline on a fixed interval: it only does anything while a capture is in flight, hits the
 * small `/v1/capture_jobs/{guid}` endpoint, and stops (clears `captureGuid`) once the job
 * reaches a terminal state — at which point the timeline is refreshed once to show the result.
 *
 * @returns {Promise<void>}
 * @async
 */
export async function archivePullCaptureStatus() {
  const auth = await Auth.fromStorage();
  const status = await Status.fromStorage();

  // Nothing is being captured: no-op (and therefore no network traffic).
  if (!status.captureGuid) {
    return;
  }

  // The capture we're polling. If a newer capture takes over `captureGuid` while we await the
  // network, the guards below skip our writes so we don't clobber it with this one's progress.
  const polledGuid = status.captureGuid;

  const api = new PermaAPI(String(auth.apiKey), PERMA_API_BASE_URL);

  let captureJob;
  try {
    captureJob = await api.pullArchiveCaptureJob(polledGuid);
  }
  catch (err) {
    // If the archive/job no longer exists, stop tracking it so we don't poll forever.
    if (err instanceof PermaAPIError && err.httpStatusCode === 404) {
      await Status.update((status) => {
        if (status.captureGuid !== polledGuid) return false; // A newer capture took over; leave it.
        status.captureGuid = "";
        status.captureStep = 0;
      });
      return;
    }
    throw err;
  }

  // Still running: record progress for the timeline's progress bar and keep polling.
  if (!TERMINAL_STATUSES.includes(captureJob.status)) {
    await Status.update((status) => {
      if (status.captureGuid !== polledGuid) return false;
      status.captureStep = captureJob.step_count;
    });
    return;
  }

  // Terminal: stop polling and refresh the timeline once to show the final state.
  await Status.update((status) => {
    if (status.captureGuid !== polledGuid) return false;
    status.captureGuid = "";
    status.captureStep = 0;
    if (captureJob.status === "failed" || captureJob.status === "invalid") {
      status.message = "error_creating_archive";
    }
  });

  await archivePullTimeline();
}
