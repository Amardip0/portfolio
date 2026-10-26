# Amardip Chaudhari Portfolio: Complete Documentation

Version 1.0 | 26 October 2026 | Live address: https://amardip.vercel.app | Source: github.com/Amardip0

## 1. Overview

This is the personal portfolio website of Amardip Premnarayan Chaudhari, MCA student and full-stack / Android developer from Chikhli, Gujarat. It is a single-page website built with React and Vite, designed as an editorial layout with alternating light and dark sections, and animated with GSAP, ScrollTrigger and Lenis.

**What the site contains**

- Hero with rolling job titles, live local time (IST) and letters that react to the pointer.
- About, What I do (pinned storytelling), Work (pinned horizontal reel of 6 projects), Toolkit, Journey, an interactive Terminal, Process, live GitHub repositories, FAQ and Contact.
- Contact form that saves every message in MongoDB and also emails it to the owner (Nodemailer + SMTP).
- Three light + dark theme combinations (Paper & Ink, Mint & Forest, Blush & Plum) with an animated theme-change transition.
- ATS-friendly resume in PDF and Word format, generated from a script.
- SEO tags, share card, structured data, accessibility features and a lite animation mode for phones.

**Technology stack**

| Layer | Technology |
|---|---|
| UI | React 19, Vite |
| Animation | GSAP 3 (ScrollTrigger, SplitText), Lenis smooth scroll |
| Styling | Plain CSS with design tokens (custom properties) |
| Fonts | Anton, Instrument Serif, Inter Tight, JetBrains Mono (bundled with @fontsource, no external requests) |
| Back end | Vercel serverless function `api/contact.js` (Node.js) |
| Database | MongoDB (collection `messages`) |
| Email | Nodemailer over SMTP (Gmail App Password recommended) |
| Local API | Express (`server.js`, port 3001) with a Vite proxy |
| Hosting | Vercel |

## 2. Quick start

**Requirements:** Node.js 18 or newer, npm, and (only for the resume script) Python 3 with `reportlab` and `python-docx`.

1. Unzip the project and open a terminal inside the folder.
2. Install packages: `npm install`
3. Create `.env.local` by copying `.env.example` and filling in your values (see section 8). The site works without it, only the contact form needs it.
4. Start the site: `npm run dev` (opens at http://localhost:5173).
5. For the contact form while developing, open a second terminal and run `npm run server`. Vite forwards `/api` to http://localhost:3001.
6. Production build: `npm run build` (output in `dist/`). Preview it with `npm run preview`.

## 3. Project structure

```
pf/
  index.html            page shell, SEO tags, share card tags, JSON-LD
  package.json          scripts and dependencies
  vite.config.js        React plugin and /api proxy to port 3001
  vercel.json           security headers and asset caching
  server.js             local Express server for the contact API
  api/contact.js        contact form handler (MongoDB + email)
  .env.example          names of the environment variables
  public/               files served as they are
    Amardip_Chaudhari_Resume.pdf / .docx
    og.png              1200x630 share card
    robots.txt
  scripts/make_resume.py   builds the resume PDF and Word files
  docs/DOCUMENTATION.md    this document
  src/
    main.jsx            entry point, fonts, styles
    App.jsx             page order, menu, back-to-top logic
    data.js             ALL text and project data (edit here)
    sections.jsx        every section component
    ui.jsx              top bar, menu, preloader, cursor, buttons
    hooks.js            themes, smooth scroll, every animation
    styles.css          all styling and the three themes
```

| File | Purpose |
|---|---|
| `src/data.js` | Single source of content: profile, about, stats, skills, journey, services, process, FAQ, projects. |
| `src/sections.jsx` | One component per section. Reads from `data.js`. |
| `src/hooks.js` | `useTheme`, `useLenis`, `glide`, `useAnimations`. All GSAP code lives here. |
| `src/ui.jsx` | Reusable interface parts: `TopBar`, `MenuOverlay`, `Preloader`, `Cursor`, `ToTop`, `Btn`, `MotionToggle`. |
| `src/styles.css` | Design tokens, themes, layout, responsive rules. |
| `api/contact.js` | Validates the form, stores it in MongoDB, emails you. |

## 4. Page sections

The page alternates light and dark blocks. Add the class `dk` to any `<section>` to make it dark.

| # | Section | id | Tone | Content comes from |
|---|---|---|---|---|
| 1 | Hero | `hero` | light | `PROFILE` |
| 2 | Marquee band | n/a | dark band | `MARQUEE` |
| 3 | About | `about` | light | `PROFILE.lead`, `ABOUT`, `STATS` |
| 4 | What I do | `services` | dark | `SERVICES` |
| 5 | Work (project reel) | `work` | light | `PROJECTS` |
| 6 | Toolkit | `skills` | dark | `SKILLS` |
| 7 | Journey | `path` | light | `JOURNEY` |
| 8 | Terminal | `terminal` | dark | `PROFILE`, `SKILLS`, `PROJECTS` (typed commands) |
| 9 | Process | `process` | light | `PROCESS` |
| 10 | Open source (GitHub) | `github` | dark | live GitHub API for `GH_USER` |
| 11 | FAQ | `faq` | light | `FAQ` |
| 12 | Contact | `contact` | dark | `PROFILE`, form |
| 13 | Footer | n/a | light | `PROFILE.city` |

## 5. Editing your content

Everything visible is in `src/data.js`. Save the file and the browser updates immediately during `npm run dev`.

| Export | What it controls |
|---|---|
| `PROFILE` | Name, city, email, GitHub, LinkedIn, site address, resume paths, rolling roles, tagline, lead paragraph. |
| `ABOUT` | The four rows under the lead paragraph: label, heading, text. |
| `STATS` | Big counters: `[number, label, decimals]`. |
| `SKILLS` | Toolkit rows: `[title, description, [tags]]`. |
| `JOURNEY` | Timeline items: `[label, heading, text]`. |
| `SERVICES` | The pinned "What I do" slides: `[title, text, [chips]]`. |
| `PROCESS` | The four process steps: `[title, text]`. |
| `FAQ` | Questions and answers. |
| `PROJECTS` | The project panels (details below). |
| `MARQUEE` | Words in the scrolling bands (use the star symbol as separator). |
| `GH_USER` | GitHub user name used by the live repository section. |

**Project fields**

| Field | Meaning |
|---|---|
| `title`, `tag` | Name and one-line description. |
| `kind` | Label such as "Android app" or "Full-stack web app". |
| `v` | Visual in the panel: `web`, `students`, `food`, `music`, `ml`. |
| `lang`, `team`, `role`, `built` | The four facts shown under the title. |
| `pts` | Bullet list of what the project does. |
| `tech` | Technology tags. |
| `live` | Deployed address. Leave empty: the "Live demo" button stays hidden. Fill it and the button appears automatically. |
| `code` | GitHub repository address (the "Source code" button). |

**Add a project**

1. Copy an existing object inside `PROJECTS` and change its fields.
2. Update the counters in `STATS` and the project names in the FAQ answer.
3. Add the project to `scripts/make_resume.py` and regenerate the resume (section 9).

**Remove a project:** delete its object from `PROJECTS` and update `STATS`, the FAQ answer and the resume script. The heading "SIX PROJECTS" is calculated from the list length automatically.

## 6. Design system

**Fonts:** Anton (headings), Instrument Serif italic (accents), Inter Tight (body), JetBrains Mono (labels). They are installed as npm packages, so the site makes no request to Google Fonts.

**Colour tokens** (defined per theme in `styles.css`)

| Token | Use |
|---|---|
| `--bg`, `--bg2` | Page and card background |
| `--ink`, `--mut` | Main and muted text |
| `--line` | Hairlines and borders |
| `--acc`, `--on` | Accent colour and the text colour placed on it |
| `--dbg`, `--dbg2`, `--dink`, `--dmut`, `--dline`, `--dacc`, `--don` | The same tokens for dark sections |

The class `.dk` swaps the normal tokens for the dark ones inside a section, so every component adapts without extra CSS.

**Themes**

| id | Name | Light base | Accent | Dark base |
|---|---|---|---|---|
| `paper` | Paper & Ink (default) | #ece8df | #f2431e | #0d0d0b |
| `mint` | Mint & Forest | #e9efe3 | #1b8a46 | #0a1510 |
| `blush` | Blush & Plum | #f6e9ea | #e2255f | #170b14 |

**Add a theme:** (1) copy one `[data-theme='...']` block in `styles.css` and change the colours, (2) add an entry to `THEMES` in `hooks.js` with `id`, `name`, `ink` and `sw: [light, accent, dark]`. The swatch buttons and the transition pick it up automatically. The choice is remembered in `localStorage`.

**Layout:** a 4-column hairline grid is drawn behind every section. Corners are square on purpose; there are no circular shapes anywhere.

## 7. Animation system

All animation code is in `src/hooks.js`. Components only contain markup.

**Libraries:** GSAP and ScrollTrigger (scroll-linked tweens, pinning), SplitText (letters, words, lines), Lenis (smooth scrolling on mouse and trackpad), and a few CSS keyframes for loops.

**Motion modes**

| Mode | What runs |
|---|---|
| Full | Everything below. Default on normal devices. |
| Lite | Gentle fades, line draws and counters only. No pinned sections, no smooth-scroll takeover. Starts automatically on phones that have "Remove animations" or battery saver on (they report reduced motion). |

The **Motion** button (in the top bar on wide screens, and in the menu on phones) switches between the two. The choice is remembered and the page reloads once.

**Responsive animation tiers.** The whole animation set is rebuilt when the window crosses a breakpoint, so it also adapts live when you resize or rotate the device.

| Tier | Width | Behaviour |
|---|---|---|
| Desktop | 1024px and up | Pinned hero curtain, pinned "What I do" story, pinned horizontal project reel, full-size movements. |
| Tablet | 861 to 1023px | Same pinned story and reel, shorter scroll distance, smaller movements. |
| Phone | 860px and below | No pins. Hero fades and drifts, services and projects become vertical stories: cards rise in, mock-ups float with scroll, bullets slide in one by one, numbers slide in. Distances and durations are shorter. |

**Animation catalogue**

| Where | Animation |
|---|---|
| Page load | Counter preloader, wipe up, hero letters rise, meta row fades in. |
| Hero | Rolling role slot (any number of roles), rows slide apart on scroll, curtain pin, letters bend toward the pointer (mouse) or a light sweeps across them (touch). |
| Headings | Masked line-by-line reveal. |
| About | Lead paragraph lights up word by word with scroll, facts and counters. |
| What I do | Pinned slides swap with scroll, side index and counter follow, outlined background text drifts. |
| Work | Pinned horizontal reel, progress bar and counter, mock-ups float against the movement. |
| Toolkit | Rows fill with accent colour on hover, tags pop in one by one. |
| Journey, Process | A line fills as you scroll and each step lights up. |
| Terminal | Types its first command by itself, then answers real commands. |
| GitHub | Cards rise in with a stagger. |
| FAQ | Accordion with animated height. |
| Contact | Giant "LET'S TALK" letters rise, rows draw their lines. |
| Footer | Large name slides up with scroll. |
| Buttons | Fill wipes up on hover, primary buttons are pulled toward the pointer. |

**Replay behaviour.** Reveals, line draws, counters and label scrambles replay every time a block comes back into view, so jumping to the bottom and returning to the top still shows animation instead of everything already finished.

**Back to top.** The square button fills with scroll progress. When pressed, its arrow launches, the page glides up with a duration that grows with the distance (about 1 to 2.8 seconds, ease-out), and the hero introduction plays again on arrival. The same distance-based gliding is used by the menu and navigation links.

**Theme change transition.** Coloured columns (in the new theme's colours with accent edges) rise in sequence, the theme swaps while the screen is covered, the theme name flashes in large type, and the columns lift away. In lite mode the theme changes instantly.

**Performance notes:** animation uses transforms and opacity; phone address-bar resizing does not restart animations; the hero pin and heavy effects are skipped on phones.

## 8. Contact form and back end

**Flow:** the browser sends `POST /api/contact` with `name`, `email`, `message` and a hidden `website` field (bot trap). The handler validates the input, saves it in MongoDB (`messages` collection), then emails it to the owner with the visitor's address as Reply-To. The form shows "Thanks" on success and a fallback message with the email address on failure.

**Environment variables** (put them in `.env.local` locally, and in Vercel under Project Settings, Environment Variables)

| Name | Meaning |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string. |
| `MONGODB_DB` | Database name (default `portfolio`). |
| `SMTP_HOST` | For Gmail: `smtp.gmail.com`. |
| `SMTP_PORT` | `465` (secure) or `587`. |
| `SMTP_USER` | The sending address. |
| `SMTP_PASS` | An app password, never the normal password. |
| `SMTP_FROM` | Optional "from" text, for example `Portfolio <you@gmail.com>`. |

**Set up step by step**

1. MongoDB Atlas: create a free cluster, a database user, allow network access (0.0.0.0/0 is needed for Vercel), copy the connection string into `MONGODB_URI`.
2. Gmail: turn on 2-step verification, create an App Password, use it as `SMTP_PASS`.
3. Local test: `npm run server` in one terminal, `npm run dev` in another, submit the form.
4. Vercel: add the same variables, then redeploy.

**Responses**

| Status | Meaning |
|---|---|
| 200 | Saved and emailed (also returned silently for bots). |
| 400 | Validation failed (name 2-100 characters, valid email, message 5-2000 characters). |
| 405 | Not a POST request. |
| 500 | Database or email not configured or unreachable. The visitor sees the direct email fallback. |

**Security.** The `.env` files are in `.gitignore` and must never be committed or shared. If a password was ever shared (for example inside a zip), change it. Possible later improvements: rate limiting per IP and a CAPTCHA.

## 9. Resume (ATS-friendly)

Files: `public/Amardip_Chaudhari_Resume.pdf` and `.docx`, both linked from the site (top bar, contact section, terminal command `resume`).

**Why it is ATS friendly:** single column, real selectable text, standard section names (Professional Summary, Technical Skills, Experience, Selected Projects, Education, Additional Information), no tables, images, icons or text boxes, consistent date format, plain bullets and readable type size.

**Edit and regenerate**

1. Edit the data lists at the top of `scripts/make_resume.py` (summary, skills, experience, projects, education, extras).
2. Install once: `pip install reportlab python-docx`.
3. Run `python scripts/make_resume.py`. Both files are rewritten in `public/`.

Keep the PDF to one page and use the same wording as the website. Upload the PDF to portals unless they ask for Word.

## 10. SEO and sharing

- `index.html` holds the title, description, canonical link, Open Graph and Twitter tags, and JSON-LD (Person schema).
- `public/og.png` is the 1200x630 share card shown by LinkedIn, WhatsApp and others.
- `public/robots.txt` allows all crawlers.
- If the web address changes, update `https://amardip.vercel.app` in `index.html` (canonical, `og:url`, `og:image`).
- After deploying, paste the address into LinkedIn Post Inspector or any link preview tool to refresh the card.

## 11. Accessibility

- "Skip to content" link, visible keyboard focus outline, `aria-label` on icon buttons.
- Escape closes the menu. The menu locks background scrolling while open.
- Lite motion mode for people who prefer less motion, and a manual Motion switch.
- Text keeps strong contrast in all three themes. The custom square cursor appears only on mouse devices.

## 12. Deployment on Vercel

1. Push the project to a GitHub repository (the `.gitignore` already excludes `node_modules`, `dist` and `.env` files).
2. On vercel.com choose Add New Project, import the repository. Framework: Vite (detected). Build command `npm run build`, output `dist`.
3. Add the environment variables from section 8, then deploy.
4. Open the live address, test the form, the resume download and a phone.
5. Optional: add a custom domain in Project Settings, Domains, then update the address in `index.html`.

Firebase Hosting can host the static site (`npm run build`, upload `dist`), but the contact API needs Vercel or another Node host.

## 13. Maintenance

- **New GitHub project:** it appears automatically in the "Live from GitHub" section. To feature it in the Work reel, add it to `PROJECTS`.
- **Deployed a project:** paste its address in `live`.
- **Update packages** now and then with `npm update`, then run `npm run build` to confirm.
- **Backups:** keep the repository on GitHub and export the MongoDB `messages` collection occasionally.

## 14. Troubleshooting

| Problem | Cause and fix |
|---|---|
| No animation on a phone | The phone has "Remove animations" or battery saver on, so the site starts in Lite mode. Press Motion in the menu to switch to Full. |
| Contact form shows the fallback message | Missing or wrong `MONGODB_URI` / SMTP values, or Atlas blocks the IP. Check Vercel logs. Locally, make sure `npm run server` is running. |
| Email not arriving | Wrong app password, or Gmail blocked the sign-in. Check spam. Port 465 needs `SMTP_PORT=465`. |
| GitHub section shows a message instead of cards | GitHub allows 60 requests per hour per visitor address, or no public repositories yet. It recovers by itself. |
| "Live demo" button missing | The `live` field of that project is empty on purpose. |
| Resume download gives 404 | The file must be inside `public/`. Re-run the resume script. |
| White flash or missing fonts | Run `npm install` again so the font packages are present. |
| Build fails after editing `data.js` | Usually a missing comma or quote. Read the line number in the error. |
| Port already in use | Stop the other process or change the port in `server.js` and `vite.config.js`. |

## 15. Credits and licences

React, Vite, GSAP (free to use under the GSAP standard license), Lenis, Express, Nodemailer, MongoDB driver, dotenv. Fonts: Anton, Instrument Serif, Inter Tight and JetBrains Mono, all open fonts distributed through @fontsource.

## Appendix A: npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload. |
| `npm run server` | Local contact API on port 3001. |
| `npm run build` | Production build into `dist/`. |
| `npm run preview` | Serves the production build locally. |

## Appendix B: Pre-launch checklist

1. All text in `data.js` is correct and spelled the way you want.
2. Project `code` links open the right repositories; `live` filled where deployed.
3. `.env.local` values work (send yourself a test message).
4. Resume regenerated after any content change.
5. Test on a phone: menu, animations, contact form, resume download.
6. Share the address once and check the preview card.
7. No `.env` file or password inside the repository or any zip you share.

## Appendix C: Glossary

| Term | Meaning |
|---|---|
| ATS | Applicant Tracking System, software that reads resumes. |
| Pin | A section that stays fixed while scrolling moves its content. |
| Scrub | Animation progress tied directly to scroll position. |
| Honeypot | A hidden form field that only bots fill. |
| JSON-LD | Structured data that helps search engines understand the page. |
