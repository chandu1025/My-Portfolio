# Gnana Chandra – Angular 19 Portfolio

Standalone-component Angular 19 app. No router, no UI library, just Angular, TypeScript and CSS.

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/portfolio/browser
```

## Edit your content

All text lives in **`src/app/data.ts`**: profile, skills, jobs, projects, live sites, education.
Change it there and every section updates.

| What | Where |
| --- | --- |
| Resume PDF (download button) | `public/Gnana_Chandra_Angular_Dev.pdf` (keep `PROFILE.resume` in sync) |
| Website screenshots | put images in `public/images/` and set `image: 'images/yourfile.png'` on a site in `data.ts` |
| Colours and fonts | CSS variables at the top of `src/styles.css` |
| Contact form inbox | create a free form on formspree.io, replace `YOUR_FORM_ID` in `src/app/sections/contact.component.ts` |

Until the Formspree ID is set, the contact form opens the visitor's email app with the message pre-filled.

## Deploy

`npm run build`, then upload `dist/portfolio/browser` to Netlify, Vercel, Cloudflare Pages or GitHub Pages.
