const menuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", !isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark text-lg"></i>'
      : '<i class="fa-solid fa-bars text-lg"></i>';
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.innerHTML = '<i class="fa-solid fa-bars text-lg"></i>';
      menuButton.setAttribute("aria-label", "Open menu");
    });
  });
}

const terminalOutput = document.getElementById("terminal-output");

if (terminalOutput) {
  const lines = [
    "$ devmemory save",
    "error Cannot read properties of undefined (reading 'map')",
    "fix guard the response before mapping — data?.items?.map(...)",
    "saved — tagged javascript, api",
    '$ devmemory find "cannot read properties of undefined"',
    "1 match — saved 3 months ago",
    "fix guard the response before mapping — data?.items?.map(...)",
  ];

  const colorizeLine = (line) => {
    const escaped = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return escaped
      .replace(
        /(\$\s?devmemory\s?[a-zA-Z0-9_\-" ]+)/g,
        '<span class="terminal-command">$1</span>',
      )
      .replace(
        /\b(error|warning|saved|match|fix)\b/gi,
        '<span class="terminal-keyword">$1</span>',
      )
      .replace(
        /("[^"]*"|'[^']*'|`[^`]*`)/g,
        '<span class="terminal-string">$1</span>',
      )
      .replace(
        /(data\?\.items\?\.map\(\.\.\.\)|core\.autocrlf|git config --global)/g,
        '<span class="terminal-function">$1</span>',
      )
      .replace(
        /\b(\d+\s*(min|months|ago)|javascript|api)\b/gi,
        '<span class="terminal-value">$1</span>',
      );
  };

  const typeLine = (line, container, callback) => {
    let index = 0;

    const tick = () => {
      if (index <= line.length) {
        const visible = line.slice(0, index);
        container.innerHTML = `${colorizeLine(visible)}<span class="terminal-cursor"></span>`;
        index += 1;
        setTimeout(tick, 18);
      } else {
        container.innerHTML = colorizeLine(line);
        if (callback) callback();
      }
    };

    tick();
  };

  let currentIndex = 0;

  const addNextLine = () => {
    if (currentIndex >= lines.length) return;

    const lineEl = document.createElement("div");
    lineEl.className = "terminal-output-line";
    terminalOutput.appendChild(lineEl);

    typeLine(lines[currentIndex], lineEl, () => {
      currentIndex += 1;
      if (currentIndex < lines.length) {
        setTimeout(addNextLine, 220);
      }
    });
  };

  addNextLine();
}
