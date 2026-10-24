# DevMemory

DevMemory is a developer-focused knowledge hub for saving, organizing, and revisiting the bug fixes, code snippets, commands, and lessons you learn while building.

## Overview

As developers, we constantly discover solutions that solve real problems — but those insights are often scattered across browser tabs, notes, bookmarks, chats, and memory. DevMemory gives you a clean, dedicated place to store the problems you solved and the fixes you want to remember.

This project includes a landing page, authentication screens, and a dashboard experience designed to feel lightweight, modern, and practical for everyday developer use.

## Features

- Save bug fixes and technical lessons
- Store reusable code snippets and commands
- Organize knowledge with tags and categories
- Browse a clean dashboard for saved memory items
- Responsive landing page and UI for desktop and mobile
- Authentication flow with sign-up, login, and password reset UX

## Tech Stack

- HTML
- CSS
- JavaScript
- Tailwind CSS
- Font Awesome icons

## Project Structure

```bash
.
├── index.html
├── login.html
├── recovery.html
├── dashboard.html
├── notes.html
├── snippets.html
├── styles.css
├── dashboard.css
├── notes.css
├── auth.css
├── script.js
├── notes.js
├── snippets.js
├── auth.js
├── img/
├── fonts/
├── .vscode/
└── README.md
```

## Pages Included

- `index.html` — marketing landing page for the product
- `login.html` — sign-up and login experience
- `recovery.html` — password recovery flow
- `dashboard.html` — knowledge overview dashboard
- `notes.html` — notes management interface
- `snippets.html` — snippet library interface

## Run Locally

Open `index.html` directly in a browser, or serve the project with a local web server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Why This Project Exists

Developers solve problems every day. The challenge is not just finding the answer once — it is remembering it when the same issue appears later. DevMemory aims to help you capture and retrieve those solutions without losing time.

## Use Cases

- Save the fix for a recurring bug
- Store a command you want to reuse
- Keep notes from debugging sessions
- Build a personal knowledge base for projects and learning
- Organize technical insights in one accessible place

## Customization

You can tailor the project by editing:

- `index.html` for content and landing-page structure
- `styles.css` for theme and layout design
- `dashboard.css`, `notes.css`, and `auth.css` for page-specific styling
- `script.js`, `notes.js`, `snippets.js`, and `auth.js` for front-end behavior

## License

This project is intended for personal and educational use. If you plan to reuse or distribute it commercially, confirm the relevant licensing terms before doing so.

## Author

Built by Den-byte001 as a practical developer memory and knowledge platform.
