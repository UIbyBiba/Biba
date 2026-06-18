# Deploying to Netlify

Each project is its **own Netlify site** (its own URL). That avoids Vite
sub-path issues and keeps things simple. Below: what to build and what to upload.

| Site | Folder | Build command | Publish folder | Suggested name |
|------|--------|---------------|----------------|----------------|
| Studio Jeju (main static site) | `.` | `bash build-site.sh` | `_studio_site` | studio-jeju |
| Candi | `candi` | `npm run build` | `candi/dist` | candi |
| Gallery | `gallery` | `npm run build` | `gallery/dist` | gallery |
| Photo Ledge | `photoledge` | `npm run build` | `photoledge/dist` | photoledge |
| Pricing app | `pricing-app` | `npm run build` | `pricing-app/dist` | pricing |
| Maxeene | `maxeene` | `npm run build` | `maxeene/dist` | maxeene |

> `candi-video` is a **Remotion video project**, not a website. To share it,
> render the MP4 (`npm run render` in `candi-video`) and either upload the file
> or embed it in one of the sites.

## Option A — Drag & drop (fastest, no account setup)

1. Build the site you want (see table). For the main static site: `bash build-site.sh`.
2. Go to <https://app.netlify.com/drop>.
3. Drag the **publish folder** onto the page. You instantly get a live URL like
   `https://maxeene.netlify.app`.
4. Repeat per site. (Create a free account to keep/rename the sites.)

## Option B — Netlify CLI

```bash
npm i -g netlify-cli
netlify login

# example: deploy maxeene
cd maxeene && npm run build && netlify deploy --prod --dir=dist
```

Each `*/netlify.toml` already declares the build command + publish dir, so a
git-connected deploy (Option C) needs no extra config.

## Option C — Git + auto-deploy (best long-term)

1. From this folder: `git init && git add . && git commit -m "initial"`.
2. Push to GitHub.
3. In Netlify: **Add new site → Import from Git**, once per app. Set the
   **base directory** to the app folder (e.g. `maxeene`). Netlify reads
   `netlify.toml` for the rest. Every `git push` then redeploys automatically.

## Custom domain (optional)

In each site: **Domain settings → Add a custom domain**, then point your DNS
(or buy a domain through Netlify). HTTPS is automatic.
