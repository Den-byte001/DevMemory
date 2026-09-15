const snippetSeed = [
  {
    id: 1,
    title: "Fetch Data With Async/Await",
    description: "A reusable function for getting JSON data from an API.",
    language: "JavaScript",
    category: "API",
    code: `async function getUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return await response.json();
}`,
    tags: ["JavaScript", "API", "Async"],
    favorite: true,
    dateSaved: "2026-09-12",
    updatedAt: "2026-09-12",
    notes: "Use this pattern when fetching data for a dashboard or list view.",
  },
  {
    id: 2,
    title: "Responsive Navbar",
    description: "A basic responsive navigation structure.",
    language: "HTML",
    category: "Components",
    code: `<nav class="flex items-center justify-between p-4">
  <div class="font-bold">Brand</div>
  <button class="md:hidden">Menu</button>
  <ul class="hidden md:flex gap-4">
    <li>Home</li>
    <li>Docs</li>
    <li>About</li>
  </ul>
</nav>`,
    tags: ["HTML", "Navbar", "Responsive"],
    favorite: false,
    dateSaved: "2026-09-08",
    updatedAt: "2026-09-08",
    notes: "Great for landing pages and dashboard shells.",
  },
  {
    id: 3,
    title: "Tailwind Button",
    description: "A reusable primary button style.",
    language: "Tailwind CSS",
    category: "Components",
    code: `<button class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
  Save changes
</button>`,
    tags: ["Tailwind CSS", "UI", "Button"],
    favorite: true,
    dateSaved: "2026-09-04",
    updatedAt: "2026-09-05",
    notes: "Use for actions that need a clear call-to-action.",
  },
  {
    id: 4,
    title: "Center an Element",
    description: "Quickly center an element horizontally and vertically.",
    language: "CSS",
    category: "Utilities",
    code: `.center {
  display: grid;
  place-items: center;
  min-height: 100vh;
}`,
    tags: ["CSS", "Flexbox", "Layout"],
    favorite: false,
    dateSaved: "2026-08-30",
    updatedAt: "2026-08-30",
    notes: "Useful when you want a single card or panel centered on the page.",
  },
  {
    id: 5,
    title: "Git Save and Push",
    description: "Common commands for saving and pushing project changes.",
    language: "Git",
    category: "Commands",
    code: `git add .
git commit -m "Update project"
git push origin main`,
    tags: ["Git", "Commands", "GitHub"],
    favorite: true,
    dateSaved: "2026-09-01",
    updatedAt: "2026-09-10",
    notes:
      "Keep this handy for regular workflow updates and collaborator syncs.",
  },
];

const state = {
  search: "",
  language: "All",
  category: "All",
  sort: "recent",
  view: "grid",
  snippets: [...snippetSeed],
  activeSnippetId: null,
};

const elements = {
  container: document.getElementById("snippetContainer"),
  emptyState: document.getElementById("emptyState"),
  searchInput: document.getElementById("searchInput"),
  languageFilter: document.getElementById("languageFilter"),
  categoryFilter: document.getElementById("categoryFilter"),
  sortSelect: document.getElementById("sortSelect"),
  gridViewButton: document.getElementById("gridViewButton"),
  listViewButton: document.getElementById("listViewButton"),
  newSnippetButton: document.getElementById("newSnippetButton"),
  openModalButton: document.getElementById("newSnippetButton"),
  modal: document.getElementById("snippetModal"),
  form: document.getElementById("snippetForm"),
  formErrors: document.getElementById("formErrors"),
  detailModal: document.getElementById("detailModal"),
  detailContent: document.getElementById("detailContent"),
  mobileDrawer: document.getElementById("mobileDrawer"),
  mobileMenuButton: document.getElementById("mobileMenuButton"),
  closeDrawerButton: document.getElementById("closeDrawerButton"),
  toast: document.getElementById("toast"),
  emptyStateButton: document.getElementById("emptyStateButton"),
};

function formatRelativeDate(dateValue) {
  const value = new Date(dateValue);
  const now = new Date();
  const diffDays = Math.max(1, Math.round((now - value) / 86400000));

  if (diffDays === 1) return "Saved yesterday";
  if (diffDays < 30) return `Saved ${diffDays} days ago`;
  if (diffDays < 365) return `Saved ${Math.round(diffDays / 30)} months ago`;
  return `Saved ${Math.round(diffDays / 365)} years ago`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderTags(tags) {
  return tags
    .map(
      (tag) =>
        `<span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[0.62rem] font-semibold text-blue-700">${escapeHtml(tag)}</span>`,
    )
    .join("");
}

function getFilteredSnippets() {
  const query = state.search.trim().toLowerCase();

  let result = [...state.snippets].filter((snippet) => {
    const matchesSearch =
      !query ||
      [
        snippet.title,
        snippet.description,
        snippet.language,
        snippet.category,
        ...snippet.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesLanguage =
      state.language === "All" || snippet.language === state.language;
    const matchesCategory =
      state.category === "All" || snippet.category === state.category;

    return matchesSearch && matchesLanguage && matchesCategory;
  });

  switch (state.sort) {
    case "oldest":
      result.sort((a, b) => new Date(a.dateSaved) - new Date(b.dateSaved));
      break;
    case "popular":
      result.sort((a, b) => Number(b.favorite) - Number(a.favorite));
      break;
    case "az":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "recent":
    default:
      result.sort((a, b) => new Date(b.dateSaved) - new Date(a.dateSaved));
      break;
  }

  return result;
}

function renderSnippetCard(snippet) {
  const codePreview = snippet.code.split("\n").slice(0, 5).join("\n");

  return `
    <article class="snippet-card group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" data-id="${snippet.id}">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-brand-600">${escapeHtml(snippet.language)}</span>
        </div>

        <button class="favorite-btn inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-400 transition hover:border-amber-200 hover:text-amber-500 ${snippet.favorite ? "text-amber-500 border-amber-200 bg-amber-50" : ""}" type="button" data-favorite-id="${snippet.id}" aria-label="Toggle favorite">
          <i class="${snippet.favorite ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
        </button>
      </div>

      <div class="mt-4">
        <button class="open-detail-btn text-left" type="button" data-detail-id="${snippet.id}">
          <h3 class="text-xl font-semibold tracking-[-0.04em] text-slate-900">${escapeHtml(snippet.title)}</h3>
        </button>
        <p class="mt-2 text-sm leading-6 text-slate-600 line-clamp-2">${escapeHtml(snippet.description)}</p>
      </div>

      <div class="code-block mt-4 overflow-hidden">
        <pre class="px-3 py-3">${escapeHtml(codePreview)}</pre>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">${renderTags(snippet.tags)}</div>

      <div class="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
        <span class="text-xs font-medium text-slate-500">${formatRelativeDate(snippet.dateSaved)}</span>
        <div class="flex items-center gap-2">
          <button class="copy-btn inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[0.7rem] font-medium text-slate-600 transition hover:border-blue-200 hover:text-brand-600" type="button" data-copy-id="${snippet.id}">
            <i class="fa-regular fa-copy"></i>
            Copy
          </button>
          <button class="open-detail-btn inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[0.7rem] font-medium text-slate-600 transition hover:border-blue-200 hover:text-brand-600" type="button" data-detail-id="${snippet.id}">
            <i class="fa-regular fa-folder-open"></i>
            Open
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderListView(snippets) {
  return snippets
    .map(
      (snippet) => `
        <article class="snippet-card flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between" data-id="${snippet.id}">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-brand-600">${escapeHtml(snippet.language)}</span>
              <button class="open-detail-btn text-left" type="button" data-detail-id="${snippet.id}">
                <h3 class="text-lg font-semibold tracking-[-0.04em] text-slate-900">${escapeHtml(snippet.title)}</h3>
              </button>
            </div>
            <p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(snippet.description)}</p>
            <div class="mt-3 flex flex-wrap gap-2">${renderTags(snippet.tags)}</div>
          </div>

          <div class="flex items-center gap-2 md:shrink-0">
            <button class="favorite-btn inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-400 transition hover:border-amber-200 hover:text-amber-500 ${snippet.favorite ? "border-amber-200 bg-amber-50 text-amber-500" : ""}" type="button" data-favorite-id="${snippet.id}" aria-label="Toggle favorite">
              <i class="${snippet.favorite ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
            </button>
            <button class="copy-btn inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[0.7rem] font-medium text-slate-600 transition hover:border-blue-200 hover:text-brand-600" type="button" data-copy-id="${snippet.id}">
              <i class="fa-regular fa-copy"></i>
              Copy
            </button>
            <button class="open-detail-btn inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[0.7rem] font-medium text-slate-600 transition hover:border-blue-200 hover:text-brand-600" type="button" data-detail-id="${snippet.id}">
              <i class="fa-solid fa-up-right-from-square"></i>
              Open
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderSnippets() {
  const visibleSnippets = getFilteredSnippets();

  if (!visibleSnippets.length) {
    elements.container.innerHTML = "";
    elements.emptyState.classList.remove("hidden");
    return;
  }

  elements.emptyState.classList.add("hidden");
  elements.container.className =
    state.view === "grid"
      ? "grid gap-5 xl:grid-cols-3 md:grid-cols-2"
      : "space-y-4";
  elements.container.innerHTML =
    state.view === "grid"
      ? visibleSnippets.map(renderSnippetCard).join("")
      : renderListView(visibleSnippets);

  syncViewButtons();
}

function syncViewButtons() {
  const isGrid = state.view === "grid";
  elements.gridViewButton.className = isGrid
    ? "inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm"
    : "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600";
  elements.listViewButton.className = isGrid
    ? "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600"
    : "inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm";
}

function openSnippetModal() {
  elements.modal.classList.remove("hidden");
  elements.modal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
}

function closeSnippetModal() {
  elements.modal.classList.add("hidden");
  elements.modal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
  elements.form.reset();
  elements.formErrors.classList.add("hidden");
  elements.formErrors.textContent = "";
}

function openDetailModal(snippetId) {
  const snippet = state.snippets.find((item) => item.id === snippetId);
  if (!snippet) return;

  document.body.classList.add("overflow-hidden");
  state.activeSnippetId = snippetId;
  document.getElementById("detailTitle").textContent = snippet.title;
  document.getElementById("detailContent").innerHTML = `
    <div class="flex flex-wrap items-center gap-3">
      <span class="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-brand-600">${escapeHtml(snippet.language)}</span>
      <span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-600">${escapeHtml(snippet.category)}</span>
      <button class="favorite-btn inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-amber-200 hover:text-amber-500 ${snippet.favorite ? "border-amber-200 bg-amber-50 text-amber-500" : ""}" type="button" data-favorite-id="${snippet.id}">
        <i class="${snippet.favorite ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
        ${snippet.favorite ? "Favorited" : "Favorite"}
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-slate-500">Description</p>
        <p class="mt-2 text-sm leading-6 text-slate-700">${escapeHtml(snippet.description)}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-slate-500">Saved</p>
        <p class="mt-2 text-sm leading-6 text-slate-700">${formatRelativeDate(snippet.dateSaved)}</p>
        <p class="mt-2 text-sm leading-6 text-slate-700">Updated ${new Date(snippet.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-semibold tracking-[-0.04em] text-slate-900">Code</h4>
        <button class="copy-btn inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-brand-600" type="button" data-copy-id="${snippet.id}">
          <i class="fa-regular fa-copy"></i>
          Copy code
        </button>
      </div>
      <div class="code-block overflow-hidden rounded-xl">
        <pre class="px-4 py-4">${escapeHtml(snippet.code)}</pre>
      </div>
    </div>

    <div class="space-y-3">
      <h4 class="text-lg font-semibold tracking-[-0.04em] text-slate-900">How it works</h4>
      <p class="text-sm leading-6 text-slate-600">${escapeHtml(snippet.notes || "This snippet is designed to help you move faster while keeping the logic easy to reuse.")}</p>
    </div>

    <div class="space-y-3">
      <h4 class="text-lg font-semibold tracking-[-0.04em] text-slate-900">When to use it</h4>
      <p class="text-sm leading-6 text-slate-600">Use this whenever you need a fast, reliable pattern that reduces repetition and keeps your code consistent across projects.</p>
    </div>

    <div class="space-y-3">
      <h4 class="text-lg font-semibold tracking-[-0.04em] text-slate-900">Related snippets</h4>
      <div class="flex flex-wrap gap-2">${renderTags(snippet.tags)}</div>
    </div>

    <div class="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
      <button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" type="button" data-edit-id="${snippet.id}">
        <i class="fa-solid fa-pen"></i>
        Edit
      </button>
      <button class="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100" type="button" data-delete-id="${snippet.id}">
        <i class="fa-solid fa-trash"></i>
        Delete
      </button>
    </div>
  `;

  elements.detailModal.classList.remove("hidden");
  elements.detailModal.classList.add("flex");
}

function closeDetailModal() {
  elements.detailModal.classList.add("hidden");
  elements.detailModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
}

async function copySnippetCode(snippetId) {
  const snippet = state.snippets.find((item) => item.id === snippetId);
  if (!snippet) return;

  try {
    await navigator.clipboard.writeText(snippet.code);
    showToast("Code copied to clipboard.");
  } catch (error) {
    showToast("Unable to copy code right now.");
  }
}

function showToast(message) {
  const toast = elements.toast;
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2200);
}

function toggleFavorite(snippetId) {
  state.snippets = state.snippets.map((item) =>
    item.id === snippetId
      ? {
          ...item,
          favorite: !item.favorite,
          updatedAt: new Date().toISOString(),
        }
      : item,
  );
  renderSnippets();

  if (state.activeSnippetId === snippetId) {
    openDetailModal(snippetId);
  }
}

function deleteSnippet(snippetId) {
  const confirmed = window.confirm(
    "Delete this snippet? This action cannot be undone.",
  );
  if (!confirmed) return;

  state.snippets = state.snippets.filter((item) => item.id !== snippetId);
  closeDetailModal();
  renderSnippets();
}

function validateSnippetForm(formData) {
  const errors = [];

  if (!formData.title.trim()) {
    errors.push("Title is required.");
  }
  if (!formData.language) {
    errors.push("Language is required.");
  }
  if (!formData.code.trim()) {
    errors.push("Code is required.");
  }

  return errors;
}

function submitSnippetForm(event) {
  event.preventDefault();

  const formData = new FormData(elements.form);
  const snippet = {
    id: Date.now(),
    title: String(formData.get("title") || "").trim(),
    description:
      String(formData.get("description") || "").trim() ||
      "Reusable code snippet.",
    language: String(formData.get("language") || "").trim(),
    category: String(formData.get("category") || "").trim() || "Other",
    code: String(formData.get("code") || "").trim(),
    tags:
      String(formData.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) || [],
    notes: String(formData.get("notes") || "").trim(),
    favorite: false,
    dateSaved: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const errors = validateSnippetForm(snippet);
  if (errors.length) {
    elements.formErrors.textContent = errors.join(" ");
    elements.formErrors.classList.remove("hidden");
    return;
  }

  state.snippets.unshift(snippet);
  closeSnippetModal();
  renderSnippets();
  showToast("Snippet saved successfully.");
}

function editSnippet(snippetId) {
  const snippet = state.snippets.find((item) => item.id === snippetId);
  if (!snippet) return;

  closeDetailModal();
  openSnippetModal();

  document.getElementById("snippetTitle").value = snippet.title;
  document.getElementById("snippetDescription").value = snippet.description;
  document.getElementById("snippetLanguage").value = snippet.language;
  document.getElementById("snippetCategory").value = snippet.category;
  document.getElementById("snippetCode").value = snippet.code;
  document.getElementById("snippetTags").value = snippet.tags.join(", ");
  document.getElementById("snippetNotes").value = snippet.notes || "";

  const form = elements.form;
  form.dataset.editId = String(snippetId);
}

function saveEditedSnippet(event) {
  event.preventDefault();

  const editId = Number(elements.form.dataset.editId || 0);
  if (!editId) {
    submitSnippetForm(event);
    return;
  }

  const formData = new FormData(elements.form);
  const updatedSnippet = {
    id: editId,
    title: String(formData.get("title") || "").trim(),
    description:
      String(formData.get("description") || "").trim() ||
      "Reusable code snippet.",
    language: String(formData.get("language") || "").trim(),
    category: String(formData.get("category") || "").trim() || "Other",
    code: String(formData.get("code") || "").trim(),
    tags:
      String(formData.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean) || [],
    notes: String(formData.get("notes") || "").trim(),
    favorite:
      state.snippets.find((item) => item.id === editId)?.favorite ?? false,
    dateSaved:
      state.snippets.find((item) => item.id === editId)?.dateSaved ??
      new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const errors = validateSnippetForm(updatedSnippet);
  if (errors.length) {
    elements.formErrors.textContent = errors.join(" ");
    elements.formErrors.classList.remove("hidden");
    return;
  }

  state.snippets = state.snippets.map((item) =>
    item.id === editId ? updatedSnippet : item,
  );
  closeSnippetModal();
  delete elements.form.dataset.editId;
  renderSnippets();
  showToast("Snippet updated successfully.");
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderSnippets();
  });

  elements.languageFilter.addEventListener("change", (event) => {
    state.language = event.target.value;
    renderSnippets();
  });

  elements.categoryFilter.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderSnippets();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderSnippets();
  });

  elements.gridViewButton.addEventListener("click", () => {
    state.view = "grid";
    renderSnippets();
  });

  elements.listViewButton.addEventListener("click", () => {
    state.view = "list";
    renderSnippets();
  });

  elements.newSnippetButton.addEventListener("click", openSnippetModal);
  elements.emptyStateButton.addEventListener("click", openSnippetModal);

  document.querySelectorAll(".close-modal-btn").forEach((button) => {
    button.addEventListener("click", closeSnippetModal);
  });

  document.querySelectorAll(".close-detail-btn").forEach((button) => {
    button.addEventListener("click", closeDetailModal);
  });

  elements.form.addEventListener("submit", (event) => {
    if (elements.form.dataset.editId) {
      saveEditedSnippet(event);
      return;
    }
    submitSnippetForm(event);
  });

  document.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite-id]");
    if (favoriteButton) {
      toggleFavorite(Number(favoriteButton.dataset.favoriteId));
      return;
    }

    const copyButton = event.target.closest("[data-copy-id]");
    if (copyButton) {
      copySnippetCode(Number(copyButton.dataset.copyId));
      return;
    }

    const detailButton = event.target.closest("[data-detail-id]");
    if (detailButton) {
      openDetailModal(Number(detailButton.dataset.detailId));
      return;
    }

    const deleteButton = event.target.closest("[data-delete-id]");
    if (deleteButton) {
      deleteSnippet(Number(deleteButton.dataset.deleteId));
      return;
    }

    const editButton = event.target.closest("[data-edit-id]");
    if (editButton) {
      editSnippet(Number(editButton.dataset.editId));
      return;
    }
  });

  elements.mobileMenuButton.addEventListener("click", () => {
    elements.mobileDrawer.classList.remove("hidden");
    document.body.classList.add("drawer-open");
    elements.mobileMenuButton.setAttribute("aria-expanded", "true");
  });

  elements.closeDrawerButton.addEventListener("click", () => {
    elements.mobileDrawer.classList.add("hidden");
    document.body.classList.remove("drawer-open");
    elements.mobileMenuButton.setAttribute("aria-expanded", "false");
  });

  elements.mobileDrawer.addEventListener("click", (event) => {
    if (event.target === elements.mobileDrawer) {
      elements.mobileDrawer.classList.add("hidden");
      document.body.classList.remove("drawer-open");
      elements.mobileMenuButton.setAttribute("aria-expanded", "false");
    }
  });
}

bindEvents();
renderSnippets();
