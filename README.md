# Bulsho Medium Psychiatric Clinic Website

Static responsive website for Bulsho Medium Psychiatric Clinic. It includes service information, a project timeline, patient journey tabs, an admission capacity calculator, printable care-summary tools, downloadable resources, and a Formspree-ready contact form.

## Files

- `index.html` - Main website page.
- `styles.css` - Responsive styling and print styles.
- `script.js` - Navigation, tabs, calculator, care summary, local draft, print, and contact-form behavior.
- `assets/clinic-hero.png` - Hero image.
- `assets/favicon.svg` - Browser tab icon.
- `downloads/` - Downloadable clinic CV, report, and guide files.
- `robots.txt` - Basic crawler access file.
- `netlify.toml` - Optional Netlify static hosting configuration.
- `tools/static-server.ps1` - Optional local preview server for Windows PowerShell.

## Run Locally

You can open `index.html` directly in a browser.

For a local HTTP preview on Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File tools\static-server.ps1 -Port 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

## Formspree Setup

1. Create a form in Formspree.
2. Copy the endpoint that looks like `https://formspree.io/f/abcdwxyz`.
3. Open `index.html`.
4. Find the contact form near the `Contact and referrals` section.
5. Replace this placeholder:

```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

with your real endpoint:

```html
action="https://formspree.io/f/abcdwxyz"
```

The form already validates name, email, and message before sending.

## Deployment

This is a plain static site, so no build step is required.

### Netlify

1. Drag this folder into Netlify Drop, or connect the repository.
2. Leave the build command empty.
3. Set the publish directory to the project root. The included `netlify.toml` already uses the root folder.

### Vercel

1. Import the repository into Vercel.
2. Choose `Other` or a static project setup.
3. Leave the build command empty.
4. Use the project root as the output directory.

### GitHub Pages

1. Push the project to a GitHub repository.
2. In repository settings, enable Pages.
3. Choose the branch and root folder.
4. Save and wait for GitHub Pages to publish.

## Pre-Deployment Checklist

- Replace the Formspree placeholder endpoint in `index.html`.
- Confirm clinic contact details and legal requirements before public use.
- Keep `index.html`, `styles.css`, `script.js`, `assets/`, and `downloads/` together.
- Test the contact form after deployment because Formspree submissions require the live endpoint.
