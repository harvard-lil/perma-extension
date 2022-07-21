/**
 * perma-extension
 * @module tests/components/ArchiveForm.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<archive-form>`.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";
import { MOCK_API_KEY, MOCK_FOLDERS_LIST, MOCK_FOLDERS_PICK } from "../mocks.js";

import { MESSAGE_IDS } from "../../src/constants/index.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// This page contains an instance of `<archive-form>`.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);
});
 
test("Enforces the singleton pattern", async ({ page, extensionId }) => {
  // Try to inject a second `<archive-form>` in the document. 
  const count = await page.evaluate(() => {
    const extra = document.createElement("archive-form");
    document.querySelector("body").appendChild(extra);
 
    return document.querySelectorAll("archive-form").length;
  });
 
  expect(count).toBe(1); // Only the first one should remain.
});

test('Sign-in form shows up (only) when `is-authenticated` is "false"',  async ({ page, extensionId }) => {
  const scenarios = [
    {
      isAuthenticated: "false",
      signInFormCount: 1,
    },
    {
      isAuthenticated: "true",
      signInFormCount: 0,
    },
  ];

  for (let scenario of Object.values(scenarios)) {
    const count = await page.evaluate(async (scenario) => {
      document.querySelector("archive-form").setAttribute("is-authenticated", scenario.isAuthenticated);

      await new Promise(resolve => requestAnimationFrame(resolve));
      
      return document.querySelectorAll("archive-form form[action='#sign-in']").length;
    }, scenario);

    expect(count).toBe(scenario.signInFormCount);
  }

});

test('Sign-in form sends `AUTH_SIGN_IN` runtime message on submit.',  async ({ page, extensionId }) => {
  // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
  const payload = await page.evaluate(async (MOCK_API_KEY) => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;

    document.querySelector("archive-form").setAttribute("is-authenticated", "false");
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
  const tabUrl = "https://lil.harvard.edu";

  await page.evaluate(async (tabUrl) => {
    document.querySelector("archive-form").setAttribute("is-authenticated", "false");
    document.querySelector("archive-form").setAttribute("tab-url", tabUrl);
    await new Promise(resolve => requestAnimationFrame(resolve));
  }, tabUrl);

  // Link is present and contains url
  const href = await page.getAttribute("form[action='#sign-in'] a:last-of-type", "href");
  expect(href).toContain(tabUrl);
});

test('Archive creation form sends `ARCHIVE_CREATE_PUBLIC` runtime message on submit.',  async ({ page, extensionId }) => {
  // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
  const payload = await page.evaluate(async (dummyApiKey) => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;

    document.querySelector("archive-form").setAttribute("is-authenticated", "true");
    await new Promise(resolve => requestAnimationFrame(resolve));

    const signInForm = document.querySelector("archive-form form[action='#create-archive']");
    signInForm.querySelector("button").click();

    return payload;
  });

  expect(payload.messageId).toBe(MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC);
});

test('Archive creation renders `folders-list`.',  async ({ page, extensionId }) => {
  const optionsHaveRendered = await page.evaluate(async (MOCK_FOLDERS_LIST) => {
    const archiveForm = document.querySelector("archive-form");

    archiveForm.setAttribute("is-authenticated", "true");
    archiveForm.setAttribute("folders-list", JSON.stringify(MOCK_FOLDERS_LIST));

    await new Promise(resolve => requestAnimationFrame(resolve));

    let optionsHaveRendered = true;

    for (let option of Object.values(MOCK_FOLDERS_LIST)) {
      if (!archiveForm.querySelector(`option[value="${option.id}"]`)) {
        optionsHaveRendered = false;
        break;
      }
    }

    return optionsHaveRendered;
  }, MOCK_FOLDERS_LIST);

  expect(optionsHaveRendered).toBe(true);
});

test('Archive creation takes into account `folder-pick`.',  async ({ page, extensionId }) => {
  const options = {
    foldersList: MOCK_FOLDERS_LIST, 
    foldersPick: MOCK_FOLDERS_PICK
  };

  const optionsIsSelected = await page.evaluate(async (options) => {
    const archiveForm = document.querySelector("archive-form");

    archiveForm.setAttribute("is-authenticated", "true");
    archiveForm.setAttribute("folders-list", JSON.stringify(options.foldersList));
    archiveForm.setAttribute("folders-pick", options.foldersPick);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    if (archiveForm.querySelector(`option[value="${options.foldersPick}"][selected]`)) {
      return true;
    }
    else {
      return false;
    }

  }, options);

  expect(optionsIsSelected).toBe(true);
});

test('Archive creation form sends `FOLDERS_PICK_ONE` runtime message on folder `<select>` change.',  async ({ page, extensionId }) => {
  const options = {
    foldersList: MOCK_FOLDERS_LIST, 
    foldersPick: MOCK_FOLDERS_PICK
  };

  // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
  const payload = await page.evaluate(async (options) => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;
    
    const archiveForm = document.querySelector("archive-form");

    archiveForm.setAttribute("is-authenticated", "true");
    archiveForm.setAttribute("folders-list", JSON.stringify(options.foldersList));

    await new Promise((resolve) => requestAnimationFrame(resolve));

    archiveForm.querySelector("select").value = options.foldersPick;
    archiveForm.querySelector("select").dispatchEvent(new Event("change"));

    return payload;

  }, options);

  expect(payload.messageId).toBe(MESSAGE_IDS.FOLDERS_PICK_ONE);
  expect(payload.folderId).toBe(String(MOCK_FOLDERS_PICK));
});

test('Inputs are disabled when `is-loading` is "true"',  async ({ page, extensionId }) => {
});
