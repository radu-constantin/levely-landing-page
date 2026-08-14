/* ============================================================
   Levely landing page — behavior
   ------------------------------------------------------------
   CONFIG: fill these in before launch.
   ============================================================ */
const CONFIG = {
  // REQUIRED for emails to actually store. Kit's form endpoint — it expects the
  // address under the field name `email_address` (see the POST below).
  // Kit sends the double opt-in confirmation; nobody joins the list until they
  // click through it.
  // Leave "" only for local testing — submit will fake success and warn.
  formEndpoint: "https://app.kit.com/forms/9801686/subscriptions",

  foundingSpots: 0,               // scarcity count; 0 hides the sentence
  handle: "@levely",                // X handle
  liquidLevel: 60                   // vial fill %, 0–100
};

/* ---------- apply config to the DOM ---------- */
(function applyConfig() {
  // vial fill
  const liquid = document.querySelector(".liquid");
  if (liquid) liquid.style.setProperty("--level", Math.max(0, Math.min(100, CONFIG.liquidLevel)) + "%");

  // scarcity line
  const scarcity = document.getElementById("scarcity");
  if (scarcity) {
    if (CONFIG.foundingSpots > 0) {
      scarcity.textContent = "Only " + CONFIG.foundingSpots + " founding spots.";
    } else {
      scarcity.remove();
    }
  }
})();

/* ---------- signup ---------- */
const form = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const submitBtn = document.getElementById("submit-btn");
const errorEl = document.getElementById("error");
const captureEl = document.querySelector(".capture");
const successEl = document.getElementById("success");

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}
function clearError() {
  errorEl.textContent = "";
  errorEl.hidden = true;
}
function setSubmitting(on) {
  submitBtn.disabled = on;
  submitBtn.textContent = on ? "Casting\u2026" : "Get founding access";
}
function showSuccess() {
  captureEl.hidden = true;
  successEl.hidden = false;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = (emailInput.value || "").trim();

  if (!EMAIL_RE.test(email)) {
    showError("That doesn't look like an email. Try again, adventurer.");
    return;
  }
  clearError();

  // No endpoint wired yet — fake success for local testing.
  if (!CONFIG.formEndpoint.trim()) {
    console.warn("[Levely] No formEndpoint set \u2014 email NOT stored. Set CONFIG.formEndpoint in app.js.");
    showSuccess();
    return;
  }

  setSubmitting(true);
  fetch(CONFIG.formEndpoint, {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: new URLSearchParams({ email_address: email })
  })
    .then(function (r) {
      if (!r.ok) throw new Error("bad status " + r.status);
      setSubmitting(false);
      showSuccess();
    })
    .catch(function () {
      setSubmitting(false);
      showError("Something glitched on my end \u2014 try again in a sec.");
    });
});

// clear the error as soon as the user starts fixing it
emailInput.addEventListener("input", clearError);

/* ---------- pause ambient animations when the page isn't in focus ----------
   The page runs several continuous CSS animations. CSS animations keep
   running even when the browser window is in the background, which keeps the
   GPU compositor busy and can make the rest of the system (e.g. scrolling in
   another app) stutter. We pause everything whenever this window/tab loses
   focus so the GPU can idle, and resume when the user comes back. */
(function pauseWhenAway() {
  const root = document.documentElement;
  const setPaused = function (paused) { root.classList.toggle("anim-paused", paused); };
  window.addEventListener("blur", function () { setPaused(true); });
  window.addEventListener("focus", function () { setPaused(false); });
  document.addEventListener("visibilitychange", function () { setPaused(document.hidden); });
  // start paused if the page loads without focus
  if (!document.hasFocus()) setPaused(true);
})();
