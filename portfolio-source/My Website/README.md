# Interactive 3D Portfolio

A dark, futuristic personal portfolio built with plain HTML/CSS/JS, [Three.js](https://threejs.org)
for the 3D scenes and [GSAP](https://gsap.com) + ScrollTrigger for the scroll animations.
No build step, no framework, no npm install required — open it and it works.

## 1. Folder structure

```
portfolio/
├── index.html          ← page structure, loads all scripts/styles
├── css/
│   └── style.css        ← all styling (design tokens at the top)
├── js/
│   ├── config.js         ← ★ EDIT THIS to add your own content
│   ├── loader.js          ← loading screen logic
│   ├── cursor.js           ← custom cursor + magnetic buttons
│   ├── three-scene.js       ← hero & contact 3D scenes
│   ├── render.js             ← renders config.js data into the page
│   ├── animations.js          ← GSAP scroll animations
│   └── main.js                  ← nav, modal, form, easter eggs
└── assets/              ← put your photo / resume / images here
```

## 2. Running it locally

Because the page fetches its own JS files, most browsers block that over
`file://`. Serve it from a tiny local server instead:

```bash
# Python (built in on most machines)
cd portfolio
python3 -m http.server 8000
# then open http://localhost:8000

# or, with Node installed:
npx serve .
```

## 3. Customizing your content — edit `js/config.js`

This is the **only file you need to touch** to make the site yours. It's a
single JavaScript object with these sections:

| Section | What it controls |
|---|---|
| `PERSONAL_INFO` | Name, role, tagline, bio, education, resume link, email |
| `STATS` | The animated numbers in the About section |
| `SKILLS` | Categorized skill cards (Programming / Development / Technology) |
| `PROJECTS` | Every project card, its modal content, and filter category |
| `EXPERIENCE` | Timeline entries |
| `ACHIEVEMENTS` | Achievement / award cards |
| `SERVICES` | The "what I can do" cards |
| `GITHUB` | Your GitHub username, for the live stats panel |
| `SOCIAL_LINKS` | Icons + URLs in the footer/contact section |

### Adding a project

Add a new object to the `PROJECTS` array in `js/config.js`:

```js
{
  id: "my-project",              // unique, used internally
  name: "My Project",
  category: "Web",               // must match one of your filter categories
  short: "One-sentence summary shown on the card.",
  tech: ["React", "Node.js"],
  image: "assets/my-project.jpg", // or any image URL
  github: "https://github.com/you/my-project",
  demo: "https://my-project.dev",
  featured: false,                // true = shows in the big "Featured" section
  problem: "What problem this solves.",
  solution: "How you solved it.",
  features: ["Feature one", "Feature two"]
}
```

That's it — the grid, filters, and modal all read from this array automatically.

### Replacing your photo / resume

Drop files into `assets/` and point to them from `PERSONAL_INFO`:

```js
avatar: "assets/avatar.jpg",
resumeUrl: "assets/resume.pdf",
```

(The About section currently shows your initials in a gradient circle instead
of an `<img>` — swap `#about-photo`'s content in `render.js` for an `<img>`
tag once you have a real photo, or just leave the initials look — it's
intentional, not a placeholder bug.)

### GitHub stats

Set your username in `config.js`:

```js
GITHUB: { username: "your-real-username", useLiveApi: true }
```

The site calls the public GitHub REST API client-side (no key needed, rate
limited to 60 requests/hour per IP by GitHub). If you hit that limit or go
offline, it falls back to a simple link to your profile.

### Contact form

The form validates client-side but has **no backend wired up** — it's a
static site. To actually receive messages, pick one:
- [Formspree](https://formspree.io) — point the form's `action` at your Formspree endpoint
- [EmailJS](https://www.emailjs.com) — call `emailjs.send()` inside the submit handler in `js/main.js`
- Your own API route, if you deploy this behind a backend

Look for the `TODO`-style comment inside `initContactForm()` in `js/main.js`.

## 4. Deploying

### GitHub Pages
1. Push this folder to a GitHub repository.
2. Repo → **Settings → Pages** → Source: `main` branch, root folder.
3. Your site goes live at `https://yourusername.github.io/repo-name`.

### Vercel
1. `npm i -g vercel` (or use the Vercel dashboard's "Import Project").
2. From the `portfolio/` folder: `vercel`.
3. Follow the prompts — no build command needed, it's static.

### Netlify
1. Drag and drop the `portfolio/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop), **or**
2. `netlify deploy` from the CLI with `portfolio/` as the publish directory.

## 5. Performance & accessibility notes

- Particle counts and some 3D detail automatically drop on screens under 760px.
- All motion respects `prefers-reduced-motion`.
- The custom cursor is disabled automatically on touch devices.
- Keyboard focus states are visible throughout; the project modal traps
  focus on its close button when opened and closes on `Escape`.

## 6. Easter eggs 🥚

- Click the logo in the nav bar 5 times quickly.
- Or try the Konami code (`↑ ↑ ↓ ↓ ← → ← → b a`).

Enjoy — and remember to replace the placeholder project images, links and
copy in `config.js` before you ship it.
