# portfolio-theme

A minimal developer portfolio built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies. Deploy it anywhere that serves static files.

## Pages

- **Home** — hero section with typewriter effect, visitor IP greeting, and social links
- **About** — short bio page
- **Projects** — list of your work with links
- **Community** — links to communities or groups you run or participate in
- **Blog** — markdown-based blog with a custom parser, no CMS required
- **Contact** — email and social links
- **404** — custom not-found page

## Getting started

1. Clone the repo
2. Search for `Your Name` and replace it with your name across all files
3. Search for `xx` and replace it with your initials (used in the navbar logo and preloader)
4. Update social links in `index.html` and `contact.html`
5. Update the typewriter phrases in `main.js`
6. Replace the placeholder projects in `projects.html`
7. Update the community links in `community.html`
8. Add your blog posts to `content/blog/posts/` and register them in `content/blog/posts.json`

## Blog

Posts are written in Markdown and stored in `content/blog/posts/`. Each post needs a corresponding entry in `content/blog/posts.json` with an `id`, `title`, `date`, `slug`, and `excerpt`.

The slug must match the filename. For example, a post registered with `"slug": "my-post"` should have its file at `content/blog/posts/my-post.md`.

## Deployment

The project includes a `vercel.json` configured for Vercel. Import the repo in the Vercel dashboard and it deploys with no configuration needed. Clean URLs and the blog rewrite are handled automatically.

For other hosts, any static file server works. The blog rewrite (`/blog/:slug` to `/blog`) needs to be configured at the host level if you want clean URLs on post pages.

## Shortlinks

To add shortlinks like `yourdomain.com/someslug`, add entries to the `redirects` array in `vercel.json`:

```json
{ "source": "/someslug", "destination": "https://destination-url.com", "permanent": false }
```

## Credits

Based on the portfolio of [Azan Waseem](https://azanw.com). Used with permission.
