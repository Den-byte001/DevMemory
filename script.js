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

  let lineIndex = 0;

  const typeLine = (line, lineElement) => {
    let charIndex = 0;
    let cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    lineElement.appendChild(cursor);

    const typeNext = () => {
      if (charIndex <= line.length) {
        lineElement.innerHTML = `${line.slice(0, charIndex)}<span class="terminal-cursor"></span>`;
        charIndex += 1;
        setTimeout(typeNext, 24);
      } else {
        lineElement.innerHTML = line;
        setTimeout(() => {
          if (lineIndex < lines.length - 1) {
            lineIndex += 1;
            typeLine(lines[lineIndex], document.createElement("div"));
          }
        }, 220);
      }
    };

    typeNext();
  };

  const firstLine = document.createElement("div");
  firstLine.className = "terminal-output-line";
  terminalOutput.appendChild(firstLine);
  typeLine(lines[0], firstLine);

  const typeNextLine = () => {
    if (lineIndex < lines.length - 1) {
      lineIndex += 1;
      const nextLine = document.createElement("div");
      nextLine.className = "terminal-output-line";
      terminalOutput.appendChild(nextLine);
      typeLine(lines[lineIndex], nextLine);
    }
  };

  const runner = () => {
    if (lineIndex < lines.length - 1) {
      setTimeout(typeNextLine, 320);
    }
  };

  typeNextLine = null;
  setTimeout(() => {
    for (let i = 1; i < lines.length; i += 1) {
      setTimeout(() => {
        const line = document.createElement("div");
        line.className = "terminal-output-line";
        terminalOutput.appendChild(line);
        typeLine(lines[i], line);
      }, 320 * i);
    }
  }, 430);
}
