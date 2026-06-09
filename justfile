# perma-extension — common project tasks.
# Run `just` (or `just --list`) to see all recipes.
#
# Every browser-specific recipe takes a `target` argument ("chrome" or "firefox") and defaults
# to chrome. The extension is built per-browser: `src/manifest.json` is shared and transformed at
# build time (see vite.config.js). TARGET=firefox swaps the Chrome MV3 `background.service_worker`
# for Firefox's `background.scripts` and adds the gecko settings; anything else builds the Chrome
# variant. So `dist/` only ever holds ONE browser's build — rebuild when you switch browsers.

# Load .env so recipes and the build see the same vars the test/build configs read via dotenv.
set dotenv-load := true

# Tests run headless by default. Set headful=1 to watch the browser: `just headful=1 test`.
headful := ""

# List available recipes (default when you run bare `just`).
default:
    @just --list

# Install dependencies: npm packages + Playwright's Chromium (needed by the test suite).
setup:
    npm install
    npx playwright install chromium

# Build the extension into dist/ for a target browser ("chrome" or "firefox").
build target="chrome":
    TARGET={{target}} npm run build

# Build a target variant, then launch it via web-ext (auto-reloads on source change).
# For firefox, set FIREFOX_BIN in .env (Developer Edition is at a non-standard path); empty = PATH.
dev target="chrome": (build target)
    #!/usr/bin/env bash
    set -euo pipefail
    if [ "{{target}}" = "firefox" ]; then
        npx web-ext run --source-dir dist --devtools ${FIREFOX_BIN:+--firefox="$FIREFOX_BIN"}
    else
        npx web-ext run --source-dir dist --target chromium
    fi

# Rebuild on every source change for a target browser.
watch target="chrome":
    TARGET={{target}} npm run dev

# Run the full Playwright suite for a target build. Scenario specs need a live TESTS_API_KEY.
test: (build "chrome")
    HEADLESS={{ if headful == "" { "true" } else { "false" } }} npx playwright test

# Run only the self-contained component tests (no API key required).
test-components target="chrome": (build target)
    HEADLESS={{ if headful == "" { "true" } else { "false" } }} npx playwright test tests/components

# Lint the built extension with web-ext (validates the manifest, etc.) for a target browser.
lint target="chrome": (build target)
    npx web-ext lint --source-dir dist

# Build a target variant and package dist/ into perma-extension-<target>.zip for distribution.
package target="chrome": (build target)
    cd dist && zip -r ../perma-extension-{{target}}.zip *

# Generate documentation.
docs:
    npm run docgen

# Remove build output.
clean:
    rm -rf dist perma-extension*.zip
