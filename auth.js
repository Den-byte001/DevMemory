const authShell = document.querySelector(".auth-shell");
const toggleButtons = document.querySelectorAll("[data-auth-toggle]");
const params = new URLSearchParams(window.location.search);
const requestedMode = params.get("mode");
const authModeStorageKey = "devmemory-auth-mode";

const getPreferredMode = () => {
  if (requestedMode === "login" || requestedMode === "signup") {
    return requestedMode;
  }

  const savedMode = window.localStorage.getItem(authModeStorageKey);
  if (savedMode === "login" || savedMode === "signup") {
    return savedMode;
  }

  return "login";
};

const setMode = (mode) => {
  if (!authShell) return;

  const normalizedMode = mode === "login" ? "login" : "signup";
  const isLogin = normalizedMode === "login";
  authShell.classList.toggle("is-login", isLogin);
  document.documentElement.setAttribute("data-auth-mode", normalizedMode);
  window.localStorage.setItem(authModeStorageKey, normalizedMode);

  toggleButtons.forEach((button) => {
    const isActive = button.dataset.authToggle === normalizedMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

const setButtonLoading = (button, isLoading) => {
  if (!button) return;

  const originalText = button.dataset.originalText || button.textContent.trim();
  button.dataset.originalText = originalText;
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);

  if (isLoading) {
    button.innerHTML = `<span class="spinner"></span><span>${originalText}</span>`;
  } else {
    button.innerHTML = originalText;
  }
};

const modal = document.getElementById("auth-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const resetPasswordForm = document.getElementById("reset-password-form");
const updatePasswordButton = document.getElementById("update-password-btn");
const modalSuccess = document.getElementById("modal-success");
const resetPasswordFormWrapper = resetPasswordForm;
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const successToLoginButton = document.getElementById("success-to-login");

const openModal = () => {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (resetPasswordForm) resetPasswordForm.reset();
  if (modalSuccess) modalSuccess.classList.add("hidden");
  if (resetPasswordFormWrapper)
    resetPasswordFormWrapper.classList.remove("hidden");
  if (modalTitle) modalTitle.textContent = "Code verified";
  if (modalDescription) {
    modalDescription.textContent =
      "Your code was verified. Please set a new password to continue.";
  }
};

const showSuccessState = () => {
  if (modalSuccess) modalSuccess.classList.remove("hidden");
  if (resetPasswordFormWrapper)
    resetPasswordFormWrapper.classList.add("hidden");
  if (modalTitle) modalTitle.textContent = "Password updated";
  if (modalDescription) {
    modalDescription.textContent = "Your password has been reset successfully.";
  }
};

const goBackToLogin = () => {
  closeModal();

  if (window.location.pathname.toLowerCase().endsWith("recovery.html")) {
    window.location.href = "login.html";
    return;
  }

  if (loginFormShell) loginFormShell.classList.remove("is-recovery");
  if (recoveryPanel) recoveryPanel.classList.remove("is-visible");
  if (codeStep) codeStep.classList.add("hidden");
  setMode("login");
};

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const loginFormShell = document.querySelector(".login-form-shell");
    if (loginFormShell) {
      loginFormShell.classList.remove("is-recovery");
      const codeStep = document.querySelector("[data-code-step]");
      if (codeStep) codeStep.classList.add("hidden");
    }

    setMode(button.dataset.authToggle);
  });
});

const passwordToggles = document.querySelectorAll("[data-password-toggle]");
passwordToggles.forEach((toggle) => {
  const targetId = toggle.dataset.passwordToggle;
  const input = document.getElementById(targetId);

  if (!input) return;

  toggle.addEventListener("click", () => {
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    toggle.innerHTML = isVisible
      ? '<i class="fa-regular fa-eye"></i>'
      : '<i class="fa-regular fa-eye-slash"></i>';
    toggle.setAttribute(
      "aria-label",
      isVisible ? "Show password" : "Hide password",
    );
  });
});

const recoveryTrigger = document.querySelector("[data-recovery-trigger]");
const loginFormShell = document.querySelector(".login-form-shell");
const recoveryPanel = document.querySelector("[data-recovery-panel]");
const codeStep = document.querySelector("[data-code-step]");
const sendCodeButton = document.querySelector("[data-send-code]");
const verifyCodeButton = document.querySelector("[data-verify-code]");
const backToLoginButton = document.querySelector("[data-back-to-login]");
const recoveryEmailInput = document.getElementById("recovery-email");
const recoveryCodeInput = document.getElementById("recovery-code");

const resetRecoveryForm = () => {
  if (loginFormShell) loginFormShell.classList.remove("is-recovery");
  if (recoveryPanel) recoveryPanel.classList.remove("is-visible");
  if (codeStep) codeStep.classList.add("hidden");
  if (recoveryEmailInput) recoveryEmailInput.value = "";
  if (recoveryCodeInput) recoveryCodeInput.value = "";
  if (sendCodeButton) sendCodeButton.disabled = true;
  if (verifyCodeButton) verifyCodeButton.disabled = true;
};

const updateRecoveryButtonState = () => {
  if (sendCodeButton && recoveryEmailInput) {
    sendCodeButton.disabled = recoveryEmailInput.value.trim().length === 0;
  }

  if (verifyCodeButton && recoveryCodeInput) {
    verifyCodeButton.disabled = recoveryCodeInput.value.trim().length === 0;
  }
};

if (recoveryTrigger && loginFormShell && recoveryPanel) {
  recoveryTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    loginFormShell.classList.add("is-recovery");
    recoveryPanel.classList.add("is-visible");
    if (codeStep) codeStep.classList.add("hidden");
    updateRecoveryButtonState();
  });
}

if (recoveryEmailInput) {
  recoveryEmailInput.addEventListener("input", () => {
    updateRecoveryButtonState();
  });
}

if (recoveryCodeInput) {
  recoveryCodeInput.addEventListener("input", () => {
    updateRecoveryButtonState();
  });
}

if (sendCodeButton && codeStep) {
  sendCodeButton.addEventListener("click", () => {
    const recoveryEmail = document.getElementById("recovery-email");
    if (recoveryEmail && recoveryEmail.value.trim()) {
      setButtonLoading(sendCodeButton, true);
      window.setTimeout(() => {
        codeStep.classList.remove("hidden");
        if (recoveryCodeInput) recoveryCodeInput.focus();
        setButtonLoading(sendCodeButton, false);
        updateRecoveryButtonState();
      }, 700);
    }
  });
}

if (backToLoginButton && loginFormShell) {
  backToLoginButton.addEventListener("click", () => {
    resetRecoveryForm();
  });
}

if (verifyCodeButton && codeStep) {
  verifyCodeButton.addEventListener("click", () => {
    const recoveryCode = document.getElementById("recovery-code");
    if (recoveryCode && recoveryCode.value.trim()) {
      setButtonLoading(verifyCodeButton, true);
      window.setTimeout(() => {
        setButtonLoading(verifyCodeButton, false);
        resetRecoveryForm();
        openModal();
      }, 800);
    }
  });
}

if (modal) {
  document.querySelectorAll("[data-close-modal]").forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
      closeModal();
      goBackToLogin();
    });
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const passwordValue = newPasswordInput.value.trim();
    const confirmValue = confirmPasswordInput.value.trim();

    if (!passwordValue || !confirmValue) {
      modalDescription.textContent = "Please fill in both password fields.";
      return;
    }

    if (passwordValue !== confirmValue) {
      modalDescription.textContent =
        "Passwords do not match. Please try again.";
      return;
    }

    setButtonLoading(updatePasswordButton, true);

    window.setTimeout(() => {
      setButtonLoading(updatePasswordButton, false);
      showSuccessState();
    }, 900);
  });
}

if (successToLoginButton) {
  successToLoginButton.addEventListener("click", () => {
    resetRecoveryForm();
    goBackToLogin();
  });
}

if (authShell) {
  setMode(getPreferredMode());
}
updateRecoveryButtonState();
