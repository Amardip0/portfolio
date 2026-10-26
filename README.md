# Amardip Chaudhari | Portfolio

Editorial, scroll-animated portfolio built with React, Vite, GSAP (ScrollTrigger + SplitText) and Lenis.
Light + dark sections, three theme combinations, a contact form that saves to MongoDB and emails the owner, and an ATS-friendly resume (PDF + Word).

Live: https://amardip.vercel.app

## Run it
```bash
npm install
npm run dev          # site at http://localhost:5173
npm run server       # second terminal: local contact API on port 3001 (needs .env.local)
npm run build        # production build in dist/
```
Copy `.env.example` to `.env.local` and fill in MongoDB and SMTP values (never commit it).

## Where things are
- `src/data.js` all text, projects, skills, links (edit here)
- `src/sections.jsx`, `src/ui.jsx` the page and interface parts
- `src/hooks.js` themes, smooth scroll and every animation
- `src/styles.css` design tokens, the three themes, responsive rules
- `api/contact.js` + `server.js` contact form back end
- `scripts/make_resume.py` rebuilds `public/Amardip_Chaudhari_Resume.pdf` and `.docx`
- `docs/DOCUMENTATION.md` (also `.docx` and `.pdf`) the complete documentation

## Good to know
- Phones with "Remove animations" or battery saver start in **Lite** motion mode. Use the **Motion** button (menu) to switch to Full.
- Project "Live demo" buttons appear automatically once a `live` address is filled in `data.js`.
- Add a theme: one block in `styles.css` plus one entry in `THEMES` in `hooks.js`.
