# Portfolio — React (Assignment 2)

CS1303 Full Stack Development — converting the static HTML/CSS portfolio
from Assignment 1 into a component-based React app with routing, state,
and side effects.
## 📽️ Video Demo

[Watch the demo on Google Drive](https://drive.google.com/drive/folders/1jEQu8INFWWU_prbf6m4gkpnkUXmptSR0?usp=drive_link)

## Setup & run

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build (verified with zero console errors)
npm run preview   # preview the production build
```

Requires Node.js 18+. No environment variables or backend are needed for
this assignment — the contact form is intentionally static.

## Component tree

```
main.jsx
 └─ BrowserRouter
     └─ ThemeProvider              (Context: theme state lives here)
         └─ App                    (defines all <Route>s)
             └─ Layout             (shared across every route)
                 ├─ Navbar         (nav links, theme toggle, mobile menu)
                 ├─ <Outlet />     → the active page:
                 │    ├─ Home                (loading state + hero)
                 │    ├─ About
                 │    │    └─ AboutContent    (bio, facts)
                 │    │         └─ Skills     (tag list — prop-drilled)
                 │    ├─ Projects
                 │    │    └─ ProjectCard × n (generic, fully prop-driven)
                 │    ├─ ProjectDetail        (reads useParams().projectId)
                 │    ├─ Contact
                 │    │    └─ ContactForm     (controlled inputs + validation)
                 │    └─ NotFound             (catch-all "*" route)
                 └─ Footer
```

## State-lifting decisions

- **Theme (light/dark):** lifted all the way up into `ThemeContext`, wrapped
  around the whole app in `main.jsx`, rather than passed as props through
  `App` → `Layout` → `Navbar`. The brief allows either props or Context for
  this one, and Context made more sense here because the theme also needs
  to reach `document.documentElement` (to set the `data-theme` attribute)
  independent of any single component's position in the tree.
- **Contact form values & errors:** kept local to `ContactForm` — nothing
  outside that component needs to know about it, so lifting it further up
  would only add indirection.
- **`showDetails` on `ProjectCard`:** deliberately local `useState` inside
  the card itself, not lifted to `Projects`. This is what keeps each card's
  "view details" toggle independent — expanding one card doesn't touch any
  other card's state, because each `ProjectCard` instance owns its own copy.
- **Prop drilling:** `About` owns a single `profile` object (bio, facts,
  skills) and passes the whole thing to `AboutContent`, which then drills
  just `profile.skills` one level further into `Skills`. `Skills` never
  sees the rest of the profile — it only knows about the array it was
  handed, which is the point of the exercise.

## useEffect hooks implemented

1. **`Home.jsx` — simulated load.** Runs once on mount (`[]` dependency
   array), sets a ~1s `setTimeout` before flipping `isLoading` to `false`.
   Cleanup clears the timeout on unmount so it can't fire after the page
   has been navigated away from.
2. **`ThemeContext.jsx` — persistence.** Runs whenever `theme` changes;
   writes the value to `localStorage` and sets `data-theme` on `<html>` so
   the CSS variables update. The value is read back on initial load via a
   lazy `useState` initializer (falls back to the OS-level colour-scheme
   preference if nothing is stored yet).
3. **`Navbar.jsx` — resize listener.** Adds a `window.resize` listener on
   mount to auto-close the mobile nav menu if the viewport grows past the
   tablet breakpoint (e.g. rotating a tablet, or resizing a browser
   window). Cleanup removes the listener on unmount.

## Routing

- `/` and `/Home` both render `Home` (the brief lists the route as
  `/Home`; `/` is included as the conventional root path with `/Home` kept
  as an explicit alias so both resolve).
- `/about`, `/projects`, `/contact` render their respective pages.
- `/projects/:projectId` is the dynamic detail route, read with
  `useParams()` in `ProjectDetail.jsx`; an unknown id shows an inline "not
  found" message with a link back to the projects list.
- `path="*"` inside the same `Layout` route catches anything else and
  renders `NotFound`, with a link back to Home.
- All in-app navigation uses `<Link>` / `<NavLink>` — no plain `<a>` tags
  for internal routes (external links to GitHub/live demos are plain
  `<a>`, which is correct since those aren't app routes).

## Known limitations

- The contact form doesn't submit anywhere; it validates and shows a
  local confirmation message only. Real submission arrives with the
  Node.js/Express backend in a later assignment.
- The "Mini Compiler" project has no live demo link (it's coursework, not
  a deployed app), so its card only shows a "view source" option.
- Project thumbnails are a single shared placeholder SVG rather than real
  screenshots — swap in actual images in `src/data/projects.js` and
  `public/` when available.

## AI assistance disclosure

Per the assignment's disclosure requirement: I used Claude (Anthropic) to
help scaffold the component structure, routing, and hook usage, and to
sanity-check accessibility and the prop-drilling/state requirements. I
reviewed, tested, and adjusted the result myself before submission.
