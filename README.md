# Westmonks

Focused B2B one-pager for Westmonks: Shopify backend automation, AI support,
custom operations workflows and a server-side Gemini storefront analysis.
Built with Next.js 16, TypeScript, Tailwind CSS, Framer Motion and Lucide React.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel configuration

Set the following environment variables in the Vercel project:

- `NEXT_PUBLIC_SITE_URL`: canonical production URL used for metadata and SEO.
- `GEMINI_API_KEY`: server-only key created in Google AI Studio. Never expose
  it through a `NEXT_PUBLIC_` variable.

Optional:

- `GEMINI_MODEL`: defaults to `gemini-3.1-flash-lite`.

The public form posts only the submitted domain to `/api/analyze`. The route
normalizes and validates the domain, applies a best-effort IP rate limit of five
requests per ten minutes, calls Gemini URL Context server-side, validates the
structured JSON response and never sends the API key to the browser. Results
are explicitly presented as storefront-based potential estimates, not as
access to Shopify Admin or private operational data.

The custom 8-second hero motion asset is H.264, has no audio and is kept below
250 KB. Regenerate the video and WebP poster with:

```bash
python3 scripts/generate_hero_video.py
```

## Deploy

Import the GitHub repository into Vercel. Framework detection and build settings
work without overrides.
