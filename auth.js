const authShell = document.querySelector(".auth-shell");
const signUpForm = document.querySelector('[data-form="signup"]');
const loginForm = document.querySelector('[data-form="login"]');
const toggleButtons = document.querySelectorAll("[data-auth-toggle]");

const setMode = (mode) => {
  const isLogin = mode === "login";
  authShell.classList.toggle("is-login", isLogin);

  toggleButtons.forEach((button) => {
    const isActive = button.dataset.authToggle === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (isLogin) {
    loginForm.classList.remove("hidden");
    loginForm.classList.add("visible");
    signUpForm.classList.remove("visible");
    signUpForm.classList.add("hidden");
  } else {
    signUpForm.classList.remove("hidden");
    signUpForm.classList.add("visible");
    loginForm.classList.remove("visible");
    loginForm.classList.add("hidden");
  }
};

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.authToggle);
  });
});

setMode("signup");
