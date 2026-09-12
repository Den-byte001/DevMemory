const authShell = document.querySelector(".auth-shell");
const toggleButtons = document.querySelectorAll("[data-auth-toggle]");
const params = new URLSearchParams(window.location.search);
const requestedMode = params.get("mode");

const setMode = (mode) => {
  const isLogin = mode === "login";
  authShell.classList.toggle("is-login", isLogin);

  toggleButtons.forEach((button) => {
    const isActive = button.dataset.authToggle === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.authToggle);
  });
});

setMode(requestedMode === "login" ? "login" : "signup");
