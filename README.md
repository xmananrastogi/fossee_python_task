# FOSSEE Workshop Portal – UI/UX Redesign

This is my redesign of the FOSSEE Workshop Booking portal ([original repo](https://github.com/FOSSEE/workshop_booking)). I rebuilt the frontend using React while keeping the Django backend as-is.

The original site uses basic Bootstrap 4 with table layouts and a dark navbar. My version is a clean, mobile-first React SPA that covers all the same pages — login, registration, workshop browsing, proposing workshops, coordinator/instructor dashboards, etc.

## Setup

**To run the redesigned frontend:**

```bash
cd static/overhaul
python3 -m http.server 8001
```

Then open http://localhost:8001.

**To run the original Django site (for comparison):**

```bash
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8002
```

Original site will be at http://localhost:8002.

## Design Decisions

### What design principles guided my improvements?

I started by actually using the original site on my phone and noting what felt off. The dark navbar was fine on desktop but ate up space on mobile, the tables were unreadable without horizontal scrolling, and the forms had tiny tap targets.

My priorities were:
- **Readability first** — I picked Inter as the main font and set up a proper type scale using `clamp()` so text is always readable, whether you're on a phone or a 27" monitor.
- **Cards over tables** — For the workshop listing, I replaced the `<table>` with a card grid that stacks naturally on mobile. Each card shows the key info (name, duration, description) at a glance.
- **Obvious actions** — The original site buries the "Propose Workshop" link in the navbar. I put it front and center with a warm amber button that stands out against the blue theme.
- **Trust signals** — The blue/white palette with amber accents felt right for an IIT Bombay-affiliated portal. Not too corporate, not too playful.

### How did I ensure responsiveness?

Three main things:

1. **CSS Grid with `auto-fill`** — The workshop cards use `repeat(auto-fill, minmax(300px, 1fr))` so they reflow from 3 columns to 1 without me writing specific breakpoints for every screen size.
2. **Mobile nav drawer** — Below 768px, the navbar links collapse into a hamburger menu that slides in from the right. I made sure every link/button in the drawer is at least 48px tall (WCAG touch target guideline).
3. **`clamp()` everywhere** — Headings, spacing, the hero section — it all scales fluidly. No awkward jumps between breakpoints.

### What trade-offs did I make?

The biggest one was using React via CDN (`unpkg.com`) instead of setting up a proper build with Vite or Create React App. This means no tree-shaking, no hot reload during development, and I'm writing components using `htm` (tagged template literals) instead of JSX.

But it also means anyone can run the project with just `python3 -m http.server` — no Node.js required. For a submission where the reviewer needs to quickly check the output, I think that's a fair trade. The total JS bundle is under 50KB gzipped.

I also decided against using Framer Motion for animations. The previous version loaded it via CDN and it kept failing in some browsers. Plain CSS transitions look fine and don't add any weight.

### What was most challenging?

Getting the mock data to match the actual Django models. The original app has a pretty complex flow — coordinators propose workshops, instructors accept them, there's email verification, role-based views, etc. I had to read through all 15 Django templates and the `views.py` to understand what data each page expects, then create mock objects that mirror the ORM models (WorkshopType, Workshop, Profile, Comment).

The other tricky part was the role-based navigation. Depending on whether you log in as a coordinator or instructor, you see different navbar links and get routed to different dashboard pages. I implemented a simple `user.position` check in the React state to handle this.

## Screenshots

### Before (original Django site)
![before](static/overhaul/screenshots/before_desktop.png)

### After — Home Page
![home](static/overhaul/screenshots/after_desktop.png)

### After — Workshop Types
![workshops](static/overhaul/screenshots/after_workshops.png)

### After — Login
![login](static/overhaul/screenshots/after_login.png)

### After — Registration Form
![register](static/overhaul/screenshots/after_register.png)

### After — Mobile View
![mobile](static/overhaul/screenshots/after_mobile_home.png)

### After — Mobile Menu
![mobile menu](static/overhaul/screenshots/after_mobile_menu.png)

## What I changed (and didn't change)

**Changed:**
- Rewrote all frontend templates as React components
- New design system in `style.css` (CSS custom properties, spacing scale, color palette)
- Added search/filter on the workshop types page
- Mobile hamburger navigation
- Accessibility improvements (ARIA roles, focus states, reduced-motion support)
- SEO meta tags (description, Open Graph, semantic HTML)

**Didn't change:**
- Django backend — all the views, models, URLs, and forms are untouched
- The database and migrations
- Static assets in `workshop_app/static/`

## Project Structure

```
static/overhaul/
├── index.html       # entry point, loads React from CDN
├── style.css        # design tokens + all component styles
├── src/
│   └── App.js       # all React components
└── screenshots/     # for this README
```

## Tech Stack

- React 18 (CDN, no build step)
- htm for JSX-like templating
- Vanilla CSS with custom properties
- Inter + Fira Code from Google Fonts

## Submission Checklist

- [x] Code is readable and well-structured
- [x] Git history shows progressive work
- [x] README includes reasoning and setup instructions
- [x] Screenshots included
- [x] Code is documented where necessary
