/**
 * perma-extension
 * @module tests/components/StatusBar.spec
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Browser-based tests for `<status-bar>`.
 */
import { expect } from "@playwright/test";
import { test, WAIT_MS_AFTER_BOOT } from "../index.js";

import { MESSAGE_IDS } from "../../src/constants/index.js";

// Refresh extension page and wait `WAIT_MS_AFTER_BOOT` ms before each test.
// This page contains an instance of `<status-bar>`.
test.beforeEach(async ({ page, extensionId }, testInfo) => {
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);
  await page.waitForTimeout(WAIT_MS_AFTER_BOOT);
});
 
test("Enforces the singleton pattern", async ({ page, extensionId }) => {
  // Try to inject a second `<status-bar>` in the document. 
  const count = await page.evaluate(() => {
    const extra = document.createElement("status-bar");
    extra.setAttribute("message", "status_default");
    document.querySelector("body").appendChild(extra);

    return document.querySelectorAll("status-bar").length;
  });
 
  expect(count).toBe(1); // Only the first one should remain.
});

test('Sign-out button shows when `is-authenticated` is "true" and `is-loading` is "false".', async ({ page, extensionId }) => {
  const scenarios = [
    {
      isAuthenticated: true,
      isLoading: false,
      buttonCount: 1,
    },
    {
      isAuthenticated: true,
      isLoading: true,
      buttonCount: 0,
    },
  ];

  for (const scenario of Object.values(scenarios)) {
    await page.evaluate(async(scenario) => {
      const statusBar = document.querySelector("status-bar");

      statusBar.setAttribute("is-authenticated", scenario.isAuthenticated);
      statusBar.setAttribute("is-loading", scenario.isLoading);

      await new Promise(resolve => requestAnimationFrame(resolve));
    }, scenario);
  
    expect(await page.getAttribute("status-bar", "is-authenticated")).toBe(`${scenario.isAuthenticated}`);
    expect(await page.getAttribute("status-bar", "is-loading")).toBe(`${scenario.isLoading}`);
  
    expect(
      await page.evaluate(() => {
        return document.querySelectorAll("status-bar > button").length;
      })
    ).toBe(scenario.buttonCount);
  }

});

test("Sign-out button sends `AUTH_SIGN_OUT` runtime message on click.", async ({ page, extensionId }) => {
  // Monkey-patch `chrome.runtime.sendMessage` to intercept message.
  const payload = await page.evaluate(async () => {
    let payload = null;
    chrome.runtime.sendMessage = data => payload = data;

    document.querySelector("status-bar").setAttribute("is-authenticated", "true");
    document.querySelector("status-bar").setAttribute("is-loading", "false");

    document.querySelector("status-bar > button").click();

    await new Promise(resolve => requestAnimationFrame(resolve));

    return payload;
  });

  expect(payload.messageId).toBe(MESSAGE_IDS.AUTH_SIGN_OUT);
});

test('`message` is observed, pulls and renders `browser.i18n` content.', async ({ page, extensionId }) => {
  const scenarios = [
    {
      key: "app_title", // Valid key, exists in "_locales/en/messages.json"
      message: "Perma.cc",
    },
    {
      key: "some_key_that_does_not_exist",
      message: "",
    },
  ];

  for (const scenario of Object.values(scenarios)) {
    await page.evaluate(async (scenario) => {
      document.querySelector("status-bar").setAttribute("message", scenario.key);
    }, scenario);
  
    expect(await page.locator("status-bar > p").innerText()).toBe(scenario.message);
    expect(await page.getAttribute("status-bar > p", "title")).toBe(scenario.message);
    expect(await page.getAttribute("status-bar > p", "aria-label")).toBe(scenario.message);
  }
});

test('Loading spinner shows (only) when `is-loading` is "true"', async ({ page, extensionId }) => {
  const scenarios = [
    {
      isLoading: false,
      spinnerCount: 0
    },
    {
      isLoading: true,
      spinnerCount: 1
    }
  ];

  for (const scenario of Object.values(scenarios)) {
    const count = await page.evaluate(async (scenario) => {
      document.querySelector("status-bar").setAttribute("is-loading", scenario.isLoading);

      await new Promise(resolve => requestAnimationFrame(resolve));
      
      return document.querySelectorAll("status-bar > img").length;
    }, scenario);
  
    expect(count).toBe(scenario.spinnerCount);
  }
});
