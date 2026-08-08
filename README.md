# Westmonks

High-end B2B one-pager for Westmonks, built with Next.js 16, TypeScript,
Tailwind CSS, Framer Motion and Lucide React.

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

Set the following environment variable in the Vercel project:

- `NEXT_PUBLIC_CALENDLY_URL`: full URL of the Calendly event.

Optional:

- `NEXT_PUBLIC_LEAD_ENDPOINT`: HTTPS endpoint accepting a JSON `POST` with
  `{ "email": "...", "source": "automatisierungs-blueprint" }`. If it is
  omitted, the PDF downloads locally and the email is not transmitted.

The included lead magnet is served from
`/automatisierungs-blueprint.pdf` and is exactly 1,500,000 bytes. Its three
binary source chunks are assembled byte-for-byte by a Node.js route so the
download stays stable across GitHub and Vercel.

Regenerate the PDF and delivery chunks with:

```bash
python3 scripts/generate_blueprint.py
```

## Deploy

Import the GitHub repository into Vercel. Framework detection and build settings
work without overrides.
