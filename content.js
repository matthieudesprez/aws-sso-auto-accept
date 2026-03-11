// AWS SSO Auto Accept - auto-clicks Allow/Accept buttons on AWS SSO consent pages
(function () {
  const MAX_WAIT_MS = 15000;
  const POLL_INTERVAL_MS = 500;

  // Button texts to look for (in order of priority)
  const TARGET_BUTTONS = ["Allow", "Confirm and continue", "Accept", "Confirm", "Approve"];

  function findAndClickButton() {
    const buttons = document.querySelectorAll(
      'button, input[type="submit"], input[type="button"]'
    );
    for (const target of TARGET_BUTTONS) {
      for (const btn of buttons) {
        const text = (btn.textContent || btn.value || "").trim();
        if (text === target) {
          btn.click();
          console.log(`[AWS SSO Auto Accept] Clicked "${target}" button`);
          return true;
        }
      }
    }
    return false;
  }

  // Use MutationObserver to catch page transitions (SPA navigation)
  let clicked = false;
  const start = Date.now();

  const observer = new MutationObserver(() => {
    if (Date.now() - start > MAX_WAIT_MS) {
      observer.disconnect();
      return;
    }
    findAndClickButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also poll as a fallback
  const interval = setInterval(() => {
    findAndClickButton();
    if (Date.now() - start > MAX_WAIT_MS) {
      clearInterval(interval);
      observer.disconnect();
    }
  }, POLL_INTERVAL_MS);

  // Try immediately
  findAndClickButton();
})();
