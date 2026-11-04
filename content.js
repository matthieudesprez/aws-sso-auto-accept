// AWS SSO Auto Accept - auto-clicks Allow/Accept buttons on AWS SSO consent pages
(function () {
  console.log("[AWS SSO Auto Accept] Loaded on", location.href);
  const MAX_WAIT_MS = 120000;
  const POLL_INTERVAL_MS = 500;

  // Button texts to look for (in order of priority)
  const TARGET_BUTTONS = ["Allow", "Allow access", "Confirm and continue", "Accept", "Confirm", "Approve"];

  // Buttons already clicked, so we don't spam the same one
  const clickedButtons = new WeakSet();

  function normalize(text) {
    return (text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function findAndClickButton() {
    const buttons = document.querySelectorAll(
      'button, input[type="submit"], input[type="button"]'
    );
    for (const target of TARGET_BUTTONS) {
      const wanted = normalize(target);
      for (const btn of buttons) {
        if (clickedButtons.has(btn) || btn.disabled) continue;
        const text = normalize(btn.textContent || btn.value);
        if (text === wanted) {
          clickedButtons.add(btn);
          btn.click();
          console.log(`[AWS SSO Auto Accept] Clicked "${target}" button`);
          return true;
        }
      }
    }
    return false;
  }

  let observer = null;
  let interval = null;
  let start = 0;

  function stop() {
    if (observer) observer.disconnect();
    if (interval) clearInterval(interval);
    observer = null;
    interval = null;
  }

  function watch() {
    stop();
    start = Date.now();

    observer = new MutationObserver(() => {
      if (Date.now() - start > MAX_WAIT_MS) return stop();
      findAndClickButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Poll as a fallback
    interval = setInterval(() => {
      if (Date.now() - start > MAX_WAIT_MS) return stop();
      findAndClickButton();
    }, POLL_INTERVAL_MS);

    findAndClickButton();
  }

  // Restart watching on SPA navigation (hash or history changes)
  window.addEventListener("hashchange", watch);
  window.addEventListener("popstate", watch);

  watch();
})();
