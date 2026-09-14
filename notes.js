const noteSeed = [
  {
    id: 1,
    category: "Bug Fix",
    title: "CRLF mismatch in Windows builds",
    description:
      "Set core.autocrlf to input and re-checkout files so line endings stay consistent across Windows and Linux.",
    content:
      "When working across Windows and Linux, line endings can easily drift and cause noisy diffs.\n\nSet the Git config to normalize input and avoid CRLF mismatches:\n\n```bash\ngit config --global core.autocrlf input\n```\n\nThen re-checkout the repo so the working tree is rewritten consistently. This helps reduce merge noise and keeps shell scripts reliable across environments.",
    tags: ["git", "windows", "shell"],
    favorite: true,
    solved: true,
    shared: false,
    createdAt: "2026-09-13T09:00:00.000Z",
    updatedAt: "2026-09-13T09:00:00.000Z",
    archived: false,
  },
  {
    id: 2,
    category: "Learning",
    title: "Understanding JavaScript closures",
    description:
      "A closure allows a function to remember variables from its outer scope even after the outer function has finished executing.",
    content:
      "Closures are created when a function retains access to variables from its lexical scope.\n\n```js\nfunction createCounter() {\n  let count = 0;\n\n  return function () {\n    count += 1;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter());\nconsole.log(counter());\n```\n\nThis pattern is useful for private state, memoized logic, and event handlers.",
    tags: ["javascript", "functions", "learning"],
    favorite: false,
    solved: false,
    shared: true,
    createdAt: "2026-09-12T08:40:00.000Z",
    updatedAt: "2026-09-12T08:40:00.000Z",
    archived: false,
  },
  {
    id: 3,
    category: "Reference",
    title: "Useful Git commands",
    description:
      "A collection of Git commands I frequently forget and need during development.",
    content:
      "Useful commands to revisit while building and debugging features:\n\n```bash\ngit status\ngit log --oneline --decorate\ngit checkout -b feature/my-fix\ngit stash pop\n```\n\nKeep a short list of commands you use often and add to it whenever you discover a new workflow.",
    tags: ["git", "terminal", "workflow"],
    favorite: true,
    solved: true,
    shared: true,
    createdAt: "2026-09-11T17:10:00.000Z",
    updatedAt: "2026-09-12T11:00:00.000Z",
    archived: false,
  },
  {
    id: 4,
    category: "Bug Fix",
    title: "Fixing API response handling",
    description:
      "Check status codes before parsing JSON and keep error fallback logic consistent.",
    content:
      "When working with APIs, do not assume every response contains valid JSON.\n\nAlways check the response status before parsing the body.\n\n```js\nconst response = await fetch(url);\n\nif (!response.ok) {\n  throw new Error(`Request failed: ${response.status}`);\n}\n\nconst data = await response.json();\n```\n\nThis prevents unexpected parsing errors and makes API failures easier to debug.",
    tags: ["api", "javascript", "errors"],
    favorite: false,
    solved: true,
    shared: true,
    createdAt: "2026-09-08T12:15:00.000Z",
    updatedAt: "2026-09-09T15:20:00.000Z",
    archived: false,
  },
  {
    id: 5,
    category: "Concept",
    title: "Event delegation",
    description:
      "Use event bubbling to handle events from multiple dynamic child elements with a single parent listener.",
    content:
      "Event delegation is a useful pattern when you render many dynamic elements. Instead of attaching individual listeners to every item, attach one listener to a parent and filter the event target.\n\n```js\ndocument.querySelector('#list').addEventListener('click', (event) => {\n  const item = event.target.closest('[data-id]');\n  if (!item) return;\n\n  console.log(item.dataset.id);\n});\n```\nThis keeps the event logic smaller and easier to maintain as the UI changes.",
    tags: ["javascript", "dom", "events"],
    favorite: false,
    solved: false,
    shared: false,
    createdAt: "2026-09-07T18:00:00.000Z",
    updatedAt: "2026-09-07T18:00:00.000Z",
    archived: false,
  },
  {
    id: 6,
    category: "Project",
    title: "Supabase authentication notes",
    description:
      "Important implementation details for authentication, sessions, protected routes, and user data.",
    content:
      "Supabase auth works well when you keep session management, route protection, and profile loading separate.\n\n- Manage session state centrally\n- Protect routes with server-side checks\n- Hydrate user profile data lazily\n- Keep auth edge cases visible in logs\n\nThis makes onboarding and debugging much easier as the product grows.",
    tags: ["supabase", "auth", "database"],
    favorite: false,
    solved: true,
    shared: true,
    createdAt: "2026-09-02T09:00:00.000Z",
    updatedAt: "2026-09-05T16:30:00.000Z",
    archived: false,
  },
];

const state = {
  notes: [...noteSeed],
  activeTab: "all",
  search: "",
  selectedNoteId: null,
  filterOpen: false,
  displayedCount: 6,
  filterOptions: {
    categories: ["Bug Fix", "Learning", "Reference", "Concept", "Project"],
    status: ["solved", "unsolved", "favorite"],
    date: ["today", "week", "month"],
  },
};

const notesGrid = document.getElementById("notes-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("note-search");
const notesCount = document.getElementById("notes-count");
const solvedCount = document.getElementById("solved-count");
const sharedCount = document.getElementById("shared-count");
const favoriteCount = document.getElementById("favorite-count");
const activeFilters = document.getElementById("active-filters");
const filterToggle = document.getElementById("filter-toggle");
const filterPopover = document.getElementById("filter-popover");
const previewDrawer = document.getElementById("note-preview");
const editorModal = document.getElementById("note-editor-modal");
const toastContainer = document.getElementById("toast-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const sortToggle = document.getElementById("sort-toggle");

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatRelative(value) {
  const now = new Date();
  const date = new Date(value);
  const diff = Math.max(0, now.getTime() - date.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  return `Updated ${days}d ago`;
}

function getVisibleNotes() {
  let filtered = [...state.notes];

  if (state.search.trim()) {
    const term = state.search.trim().toLowerCase();
    filtered = filtered.filter((note) => {
      const haystack = [
        note.title,
        note.description,
        note.content,
        note.category,
        ...note.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }

  if (state.activeTab === "favorites") {
    filtered = filtered.filter((note) => note.favorite);
  }

  if (state.activeTab === "recent") {
    filtered = filtered.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    );
  }

  if (state.activeTab === "archived") {
    filtered = filtered.filter((note) => note.archived);
  }

  const selectedCategories = Array.from(
    document.querySelectorAll(
      '#filter-popover input[value="Bug Fix"], #filter-popover input[value="Learning"], #filter-popover input[value="Reference"], #filter-popover input[value="Concept"], #filter-popover input[value="Project"]',
    ),
  )
    .filter((input) => input.checked)
    .map((input) => input.value);

  if (selectedCategories.length > 0) {
    filtered = filtered.filter((note) =>
      selectedCategories.includes(note.category),
    );
  }

  const selectedStatus = Array.from(
    document.querySelectorAll(
      '#filter-popover input[type="checkbox"][value="solved"], #filter-popover input[type="checkbox"][value="unsolved"], #filter-popover input[type="checkbox"][value="favorite"]',
    ),
  )
    .filter((input) => input.checked)
    .map((input) => input.value);
  if (selectedStatus.length > 0) {
    filtered = filtered.filter((note) => {
      const statuses = {
        solved: note.solved,
        unsolved: !note.solved,
        favorite: note.favorite,
      };
      return selectedStatus.some((value) => statuses[value]);
    });
  }

  filtered = filtered.slice(0, state.displayedCount);
  return filtered;
}

function updateSummaryCounts() {
  const total = state.notes.length;
  const solved = state.notes.filter((note) => note.solved).length;
  const shared = state.notes.filter((note) => note.shared).length;
  const favorites = state.notes.filter((note) => note.favorite).length;

  notesCount.textContent = total;
  solvedCount.textContent = solved;
  sharedCount.textContent = shared;
  favoriteCount.textContent = favorites;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}

function renderFilterPills() {
  const pills = [
    ...document.querySelectorAll("#filter-popover input:checked"),
  ].slice(0, 3);

  activeFilters.innerHTML = "";

  pills.forEach((input) => {
    const pill = document.createElement("span");
    pill.className = "filter-pill";
    pill.innerHTML = `<span>${input.value}</span><button type="button" aria-label="Remove filter">×</button>`;
    pill.querySelector("button").addEventListener("click", () => {
      input.checked = false;
      renderAll();
    });
    activeFilters.appendChild(pill);
  });
}

function renderNoteCard(note) {
  const card = document.createElement("article");
  card.className = "note-card";
  card.dataset.id = String(note.id);

  card.innerHTML = `
    <div class="note-card-header">
      <div class="note-meta">
        <p class="note-category">${note.category.toUpperCase()}</p>
        <h3 class="note-title">${note.title}</h3>
      </div>
      <button class="note-bookmark ${note.favorite ? "is-favorite" : ""}" type="button" aria-label="Toggle favorite" data-bookmark-id="${note.id}">
        <i class="fa-solid fa-bookmark"></i>
      </button>
    </div>

    <p class="note-description">${note.description}</p>

    <div class="note-tags">
      ${note.tags
        .slice(0, 3)
        .map((tag) => `<span class="note-tag">${tag}</span>`)
        .join("")}
    </div>

    <div class="note-footer">
      <span class="note-date">${formatRelative(note.updatedAt)}</span>
      <div class="note-actions">
        <button type="button" class="note-action" data-open-note="${note.id}">Open</button>
        <button type="button" class="note-action" data-bookmark-id="${note.id}">Save</button>
        <button type="button" class="note-action" data-more-note="${note.id}">More</button>
      </div>
    </div>
  `;

  card.addEventListener("click", (event) => {
    if (
      event.target.closest("[data-bookmark-id]") ||
      event.target.closest("[data-more-note]")
    ) {
      return;
    }

    openPreview(note.id);
  });

  card.querySelectorAll("[data-bookmark-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(note.id);
    });
  });

  card.querySelector("[data-open-note]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    openPreview(note.id);
  });

  card.querySelector("[data-more-note]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    openPreview(note.id);
  });

  return card;
}

function renderNotes() {
  notesGrid.innerHTML = "";
  const filtered = getVisibleNotes();

  if (!filtered.length) {
    emptyState.classList.remove("hidden");
    notesGrid.classList.add("hidden");
    loadMoreBtn.closest(".load-more-wrap").classList.add("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  notesGrid.classList.remove("hidden");
  loadMoreBtn.closest(".load-more-wrap").classList.remove("hidden");

  filtered.forEach((note) => {
    notesGrid.appendChild(renderNoteCard(note));
  });
}

function renderAll() {
  updateSummaryCounts();
  renderFilterPills();
  renderNotes();
}

function toggleFavorite(id) {
  const note = state.notes.find((item) => item.id === Number(id));
  if (!note) return;

  note.favorite = !note.favorite;
  note.updatedAt = new Date().toISOString();

  const message = note.favorite
    ? "Note added to favorites"
    : "Note removed from favorites";
  showToast(message);
  renderAll();
}

function openPreview(id) {
  const note = state.notes.find((item) => item.id === Number(id));
  if (!note) return;

  state.selectedNoteId = note.id;
  document.getElementById("preview-category").textContent = note.category;
  document.getElementById("preview-title").textContent = note.title;
  document.getElementById("preview-created").textContent = formatDate(
    note.createdAt,
  );
  document.getElementById("preview-updated").textContent = formatDate(
    note.updatedAt,
  );
  document.getElementById("preview-description").textContent = note.description;

  const previewContent = document.getElementById("preview-content");
  const content = note.content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<div class="code-block-wrap"><button class="code-copy-btn" type="button">Copy</button><pre><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre></div>`;
    })
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");

  previewContent.innerHTML = content;

  const previewTags = document.getElementById("preview-tags");
  previewTags.innerHTML = note.tags
    .map((tag) => `<span class="note-tag">${tag}</span>`)
    .join("");

  const favoriteBtn = document.getElementById("preview-favorite-btn");
  favoriteBtn.innerHTML = note.favorite
    ? '<i class="fa-solid fa-bookmark"></i> Favorited'
    : '<i class="fa-regular fa-bookmark"></i> Favorite';
  favoriteBtn.onclick = () => {
    toggleFavorite(note.id);
    openPreview(note.id);
  };

  previewDrawer.classList.add("is-open");
  previewDrawer.setAttribute("aria-hidden", "false");

  previewDrawer.querySelectorAll("[data-close-drawer]").forEach((button) => {
    button.onclick = () => closePreview();
  });

  previewDrawer
    .querySelector(".code-copy-btn")
    ?.addEventListener("click", async () => {
      const code = previewDrawer.querySelector("pre code")?.textContent || "";
      await navigator.clipboard.writeText(code);
      showToast("Copied to clipboard");
    });
}

function closePreview() {
  previewDrawer.classList.remove("is-open");
  previewDrawer.setAttribute("aria-hidden", "true");
}

function escapeHtml(string) {
  return string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function openEditor() {
  editorModal.classList.remove("hidden");
  editorModal.setAttribute("aria-hidden", "false");
}

function closeEditor() {
  editorModal.classList.add("hidden");
  editorModal.setAttribute("aria-hidden", "true");
}

function resetEditorForm() {
  document.getElementById("new-note-form").reset();
}

function createNoteFromForm(event) {
  event.preventDefault();
  const title = document.getElementById("note-title").value.trim();
  const category = document.getElementById("note-category").value;
  const description = document.getElementById("note-description").value.trim();
  const content = document.getElementById("note-content").value.trim();
  const tagsInput = document.getElementById("note-tags").value.trim();
  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : ["general"];

  if (!title || !content) {
    showToast("Title and content are required");
    return;
  }

  const newNote = {
    id: Date.now(),
    category,
    title,
    description: description || "A helpful note saved for later reference.",
    content,
    tags,
    favorite: document.getElementById("note-favorite").checked,
    solved: document.getElementById("note-solved").checked,
    shared: document.getElementById("note-shared").checked,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false,
  };

  state.notes.unshift(newNote);
  state.displayedCount = Math.max(state.displayedCount, 6);
  renderAll();
  closeEditor();
  resetEditorForm();
  showToast("Note saved successfully");
}

function applyFilters() {
  filterPopover.classList.add("hidden");
  state.filterOpen = false;
  renderAll();
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  state.displayedCount = 6;
  renderAll();
});

filterToggle.addEventListener("click", () => {
  state.filterOpen = !state.filterOpen;
  filterPopover.classList.toggle("hidden", !state.filterOpen);
});

sortToggle.addEventListener("click", () => {
  state.notes = [...state.notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
  renderAll();
  showToast("Sorted by newest first");
});

document
  .querySelector("[data-apply-filters]")
  .addEventListener("click", applyFilters);
document.querySelector("[data-reset-filters]").addEventListener("click", () => {
  document
    .querySelectorAll('#filter-popover input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = true;
    });
  renderAll();
});

document.querySelectorAll(".filter-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-tab")
      .forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    state.activeTab = tab.dataset.filterTab;
    renderAll();
  });
});

document
  .getElementById("new-note-form")
  .addEventListener("submit", createNoteFromForm);
document.getElementById("open-new-note").addEventListener("click", openEditor);
document
  .querySelector("[data-create-first-note]")
  .addEventListener("click", openEditor);

document.querySelectorAll("[data-close-editor]").forEach((button) => {
  button.addEventListener("click", closeEditor);
});

loadMoreBtn.addEventListener("click", () => {
  state.displayedCount += 3;
  renderNotes();
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openEditor();
  }

  if (event.key === "Escape") {
    closePreview();
    closeEditor();
  }
});

const mobileMenuButton = document.querySelector(".mobile-menu-button");
const appShell = document.querySelector(".app-shell");
const sidebarDismissButton = document.querySelector("[data-close-nav]");

function setMobileMenuState(isOpen) {
  if (!appShell) return;
  appShell.classList.toggle("nav-open", isOpen);
  document.body.classList.toggle(
    "mobile-menu-open",
    isOpen && window.innerWidth <= 980,
  );
  if (mobileMenuButton) {
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  }
}

if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = !appShell.classList.contains("nav-open");
    setMobileMenuState(isOpen);
  });
}

if (sidebarDismissButton) {
  sidebarDismissButton.addEventListener("click", () => {
    setMobileMenuState(false);
  });
}

document.addEventListener("click", (event) => {
  if (window.innerWidth > 980) return;
  const sidebar = document.querySelector(".sidebar");
  const clickedInsideSidebar = sidebar && sidebar.contains(event.target);
  const clickedToggle =
    mobileMenuButton && mobileMenuButton.contains(event.target);

  if (
    !clickedInsideSidebar &&
    !clickedToggle &&
    appShell.classList.contains("nav-open")
  ) {
    setMobileMenuState(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    setMobileMenuState(false);
  }
});

renderAll();
