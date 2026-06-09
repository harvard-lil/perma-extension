/**
 * perma-extension
 * @module tests/components/ArchiveForm.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<archive-form>`.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MOCK_API_KEY, MOCK_FOLDERS_CASCADE, MOCK_TAB_URL } from "../mocks.js";
import { MESSAGE_IDS } from "../../src/constants/index.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// This page contains an instance of `<archive-form>`.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);
});

test("Enforces the singleton pattern.", async ({ page, extensionId }) => {
  // Try to inject a second `<archive-form>` in the document.
  const count = await page.evaluate(() => {
    const extra = document.createElement("archive-form");
    document.querySelector("body").appendChild(extra);

    return document.querySelectorAll("archive-form").length;
  });

  expect(count).toBe(1); // Only the first one should remain.
});

test('Sign-in form shows up (only) when `auth-state` is "signedout".',  async ({ page, extensionId }) => {
  const scenarios = [
    {
      authState: "signedout",
      signInFormCount: 1,
    },
    {
      authState: "valid",
      signInFormCount: 0,
    },
  ];

  for (let scenario of Object.values(scenarios)) {
    const count = await page.evaluate(async (scenario) => {
      document.querySelector("archive-form").setAttribute("auth-state", scenario.authState);

      await new Promise(resolve => requestAnimationFrame(resolve));

      return document.querySelectorAll("archive-form form[action='#sign-in']").length;
    }, scenario);

    expect(count).toBe(scenario.signInFormCount);
  }

});

test('Invalid-key panel shows (only) when `auth-state` is "invalid", with retry + update-key buttons and the key hint.', async ({ page, extensionId }) => {
  const result = await page.evaluate(async () => {
    const archiveForm = document.querySelector("archive-form");
    archiveForm.setAttribute("key-hint", "aB3z");
    archiveForm.setAttribute("auth-state", "invalid");
    await new Promise(resolve => requestAnimationFrame(resolve));

    return {
      panelCount: archiveForm.querySelectorAll(".invalid-key").length,
      signInFormCount: archiveForm.querySelectorAll("form[action='#sign-in']").length,
      retryCount: archiveForm.querySelectorAll('.invalid-key button[data-action="retry"]').length,
      updateCount: archiveForm.querySelectorAll('.invalid-key button[data-action="update-key"]').length,
      text: archiveForm.querySelector(".invalid-key p")?.innerText ?? "",
    };
  });

  expect(result.panelCount).toBe(1);
  expect(result.signInFormCount).toBe(0);
  expect(result.retryCount).toBe(1);
  expect(result.updateCount).toBe(1);
  expect(result.text).toContain("aB3z"); // Key hint surfaced so the user knows which key failed.
});

test('Invalid-key panel "Retry" sends `AUTH_CHECK`; "Update key" reveals the sign-in form.', async ({ page, extensionId }) => {
  const result = await page.evaluate(async (AUTH_CHECK) => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;

    const archiveForm = document.querySelector("archive-form");
    archiveForm.setAttribute("auth-state", "invalid");
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Retry re-checks the stored key.
    archiveForm.querySelector('button[data-action="retry"]').click();
    const retryMessageId = payload?.messageId;

    // Update key swaps the panel for the sign-in form (without changing `auth-state`).
    archiveForm.querySelector('button[data-action="update-key"]').click();
    await new Promise(resolve => requestAnimationFrame(resolve));

    return {
      retryMessageId,
      signInFormCount: archiveForm.querySelectorAll("form[action='#sign-in']").length,
      panelCount: archiveForm.querySelectorAll(".invalid-key").length,
    };
  }, MESSAGE_IDS.AUTH_CHECK);

  expect(result.retryMessageId).toBe(MESSAGE_IDS.AUTH_CHECK);
  expect(result.signInFormCount).toBe(1);
  expect(result.panelCount).toBe(0);
});

test('Sign-in form sends `AUTH_SIGN_IN` runtime message on submit.',  async ({ page, extensionId }) => {
  // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
  const payload = await page.evaluate(async (MOCK_API_KEY) => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;

    document.querySelector("archive-form").setAttribute("auth-state", "signedout");
    await new Promise(resolve => requestAnimationFrame(resolve));

    const signInForm = document.querySelector("archive-form form[action='#sign-in']");
    signInForm.querySelector("input[name='api-key']").value = MOCK_API_KEY;
    signInForm.querySelector("button").click();
    await new Promise(resolve => requestAnimationFrame(resolve));

    return payload;
  }, MOCK_API_KEY);

  // Note: if authentication were successful, we would get more than 1 message being sent.
  expect(payload.messageId).toBe(MESSAGE_IDS.AUTH_SIGN_IN);
  expect(payload.apiKey).toBe(MOCK_API_KEY);
});

test("Sign-in form has a working link to Perma.cc's bookmarklet feature.",  async ({ page, extensionId }) => {
  const tabUrl = MOCK_TAB_URL;

  await page.evaluate(async (tabUrl) => {
    document.querySelector("archive-form").setAttribute("auth-state", "signedout");
    document.querySelector("archive-form").setAttribute("tab-url", tabUrl);
    await new Promise(resolve => requestAnimationFrame(resolve));
  }, tabUrl);

  // Link is present and contains url
  const href = await page.getAttribute("form[action='#sign-in'] a:last-of-type", "href");
  expect(href).toContain(tabUrl);
});

test('Non-capturable tabs show the "can\'t be archived" panel instead of the create form.', async ({ page, extensionId }) => {
  // A representative non-capturable url per category Perma refuses (see `isCapturableUrl`).
  const nonCapturableUrls = [
    "about:blank",                 // browser-internal page
    "chrome://extensions",         // non-http scheme
    "https://perma.cc/ABCD-1234",  // perma link (not re-capturable)
    "http://localhost:3000/",      // address Perma's servers can't reach
  ];

  for (let tabUrl of nonCapturableUrls) {
    const result = await page.evaluate(async (tabUrl) => {
      const archiveForm = document.querySelector("archive-form");
      archiveForm.setAttribute("auth-state", "valid");
      archiveForm.setAttribute("tab-url", tabUrl);
      await new Promise(resolve => requestAnimationFrame(resolve));

      return {
        panelCount: archiveForm.querySelectorAll(".not-capturable").length,
        createFormCount: archiveForm.querySelectorAll("form[action='#create-archive']").length,
      };
    }, tabUrl);

    expect(result.panelCount, tabUrl).toBe(1);
    expect(result.createFormCount, tabUrl).toBe(0);
  }
});

test('Archive creation form sends `ARCHIVE_CREATE_PUBLIC` runtime message on submit.',  async ({ page, extensionId }) => {
  // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
  const payload = await page.evaluate(async ({ cascade, tabUrl }) => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;

    const archiveForm = document.querySelector("archive-form");
    archiveForm.setAttribute("auth-state", "valid");
    archiveForm.setAttribute("tab-url", tabUrl); // Capturable url -> the create form renders.
    // A folder target is required for the "Create" button to be enabled (it sets `parentFolderId`).
    archiveForm.setAttribute("folders-cascade", JSON.stringify(cascade));
    await new Promise(resolve => requestAnimationFrame(resolve));

    const createForm = archiveForm.querySelector("form[action='#create-archive']");
    createForm.querySelector("button").click();

    return payload;
  }, { cascade: MOCK_FOLDERS_CASCADE, tabUrl: MOCK_TAB_URL });

  expect(payload.messageId).toBe(MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC);
});

test('Archive creation renders the folder cascade (`folders-cascade`).',  async ({ page, extensionId }) => {
  const optionsHaveRendered = await page.evaluate(async ({ cascade, tabUrl }) => {
    const archiveForm = document.querySelector("archive-form");

    archiveForm.setAttribute("auth-state", "valid");
    archiveForm.setAttribute("tab-url", tabUrl); // Capturable url -> the create form renders.
    archiveForm.setAttribute("folders-cascade", JSON.stringify(cascade));

    await new Promise(resolve => requestAnimationFrame(resolve));

    let optionsHaveRendered = true;

    for (let option of cascade.levels[0]) {
      if (!archiveForm.querySelector(`option[value="${option.id}"]`)) {
        optionsHaveRendered = false;
        break;
      }
    }

    return optionsHaveRendered;
  }, { cascade: MOCK_FOLDERS_CASCADE, tabUrl: MOCK_TAB_URL });

  expect(optionsHaveRendered).toBe(true);
});

test('Archive creation marks the picked folder (`cascade.pick`) as selected.',  async ({ page, extensionId }) => {
  const optionIsSelected = await page.evaluate(async ({ cascade, tabUrl }) => {
    const archiveForm = document.querySelector("archive-form");

    archiveForm.setAttribute("auth-state", "valid");
    archiveForm.setAttribute("tab-url", tabUrl); // Capturable url -> the create form renders.
    archiveForm.setAttribute("folders-cascade", JSON.stringify(cascade));

    await new Promise((resolve) => requestAnimationFrame(resolve));

    return Boolean(archiveForm.querySelector(`option[value="${cascade.pick}"][selected]`));
  }, { cascade: MOCK_FOLDERS_CASCADE, tabUrl: MOCK_TAB_URL });

  expect(optionIsSelected).toBe(true);
});

test('Archive creation form sends `FOLDERS_PICK_ONE` runtime message on folder `<select>` change.',  async ({ page, extensionId }) => {
  // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
  const payload = await page.evaluate(async ({ cascade, tabUrl }) => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;

    const archiveForm = document.querySelector("archive-form");

    archiveForm.setAttribute("auth-state", "valid");
    archiveForm.setAttribute("tab-url", tabUrl); // Capturable url -> the create form renders.
    archiveForm.setAttribute("folders-cascade", JSON.stringify(cascade));

    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Change the top-level (level 0) cascade select to a different folder.
    const select = archiveForm.querySelector("select[data-level='0']");
    select.value = "2";
    select.dispatchEvent(new Event("change"));

    return payload;

  }, { cascade: MOCK_FOLDERS_CASCADE, tabUrl: MOCK_TAB_URL });

  expect(payload.messageId).toBe(MESSAGE_IDS.FOLDERS_PICK_ONE);
  expect(payload.level).toBe(0);
  expect(payload.folderId).toBe("2");
});

test('Inputs are disabled when `is-loading` is "true"',  async ({ page, extensionId }) => {
  const scenarios = [
    {
      authState: "signedout", // Sign-in form
      cascade: null,
    },
    {
      authState: "valid", // Archive creation form, with a rendered folder cascade
      cascade: MOCK_FOLDERS_CASCADE,
      tabUrl: MOCK_TAB_URL, // Capturable url -> the create form (with its inputs) renders.
    }
  ];

  for (let scenario of scenarios) {
    const inputsAreDisabled = await page.evaluate(async (scenario) => {
      const archiveForm = document.querySelector("archive-form");

      archiveForm.setAttribute("auth-state", scenario.authState);
      archiveForm.setAttribute("is-loading", "true");

      if (scenario.tabUrl) {
        archiveForm.setAttribute("tab-url", scenario.tabUrl);
      }

      if (scenario.cascade) {
        archiveForm.setAttribute("folders-cascade", JSON.stringify(scenario.cascade));
      }

      await new Promise((resolve) => requestAnimationFrame(resolve));

      let inputsAreDisabled = true;

      for (let input of archiveForm.querySelectorAll("input, select, button")) {
        if (!input.getAttribute("disabled")) {
          inputsAreDisabled = false;
          break;
        }
      }

      return inputsAreDisabled;
    }, scenario);

    expect(inputsAreDisabled).toBe(true);
  }
});
