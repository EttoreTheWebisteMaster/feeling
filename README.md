<p align="center">
  <img src="https://www.ettoreserra.it/img/projects/feeling/logo.webp" alt="Feeling logo" width="120" />
</p>

<h1 align="center">Feeling</h1>

<p align="center">
  Streetwear e-commerce for an AI-driven clothing brand: every ad, model and product graphic is made with generative AI.
</p>

<p align="center">
  <a href="https://feeling-eta.vercel.app"><strong>Live site</strong></a> ·
  <a href="https://www.ettoreserra.it/projects/feeling">Case study</a> ·
  <a href="https://www.ettoreserra.it">Portfolio</a>
</p>

---

## Overview

Feeling is a clothing brand that had been dormant for years and came back with a new identity built around generative AI. The relaunch leaned on a **resurrection theme** inspired by Halloween: a zombie-inspired collection that stands for the brand returning from the dead.

This repository is the **full-stack e-commerce site** for the relaunch: a customer storefront with Stripe checkout and transactional emails, plus an admin dashboard for managing products, collections and orders.

| | |
|---|---|
| **Timeline** | October 2024 – December 2024 |
| **Role** | Designer, Developer, Marketer |
| **Deliverables** | Website, AI product graphics, AI advertising videos |

![Feeling products](https://www.ettoreserra.it/img/projects/feeling/products.webp)

## Features

### Storefront
- **Collections** with a video hero, title and description, each grouping its own products
- **Product pages** with a six-image gallery (Embla carousel), size selection and sold-out states
- **Checkout** with Stripe Payment Element, confirmed server-side through a Stripe webhook
- **Order history by email**: customers enter their address and receive a link to their past orders

### Emails
Built with React Email and sent through Resend:
- Purchase receipt after a successful payment
- Order history on request
- Shipping notification with tracking number

### Admin dashboard (`/admin`)
- Create, edit, publish and mark products as sold out
- Manage collections and assign products to them
- View customers and orders, add a shipping number (which triggers the shipping email)
- Images and videos uploaded to Vercel Blob
- Protected by HTTP Basic Auth via Next.js middleware

![Feeling website](https://www.ettoreserra.it/img/projects/feeling/website.webp)

## Tech stack

| Area | Tools |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/) |
| UI | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) + Radix, Lucide icons, Embla Carousel |
| Data | [Prisma](https://www.prisma.io/) + PostgreSQL, [Zod](https://zod.dev/) validation |
| Payments | [Stripe](https://stripe.com/) |
| Email | [React Email](https://react.email/) + [Resend](https://resend.com/) |
| Storage & hosting | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob), [Vercel](https://vercel.com/) |
| Design | [Figma](https://www.figma.com/) |
| Creative | Generative AI, Adobe Photoshop, iMovie |

## Project structure

```
prisma/
  schema.prisma           # Product, Collection, User, Order
src/
  app/
    (customerFacing)/     # Home, collections, products, checkout, orders
    admin/                # Dashboard: products, collections, orders, users
    webhooks/stripe/      # Stripe webhook → creates order, sends receipt
  actions/                # Server actions (e.g. order history email)
  components/ui/          # shadcn/ui components
  email/                  # React Email templates
  lib/                    # Upload, cache, formatters, password check
  middleware.ts           # Basic Auth for /admin
```

## Getting started

### Prerequisites
- Node.js 18+
- A PostgreSQL database
- A [Stripe](https://dashboard.stripe.com/) account and the [Stripe CLI](https://stripe.com/docs/stripe-cli)
- A [Resend](https://resend.com/) account
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store

### 1. Install

```bash
git clone https://github.com/EttoreTheWebisteMaster/feeling.git
cd feeling
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```bash
# Database (Prisma)
POSTGRES_PRISMA_URL=           # pooled connection string
POSTGRES_URL_NON_POOLING=      # direct connection, used for migrations

# App
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Admin (Basic Auth)
ADMIN_USERNAME=
HASHED_ADMIN_PASSWORD=         # base64 SHA-512 hash, see below

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_WEBHOOK_SECRET=         # printed by `stripe listen`

# Email
RESEND_API_KEY=
SENDER_EMAIL=

# Uploads
BLOB_READ_WRITE_TOKEN=
```

To generate `HASHED_ADMIN_PASSWORD`:

```bash
node -e "console.log(require('crypto').createHash('sha512').update(process.argv[1]).digest('base64'))" 'your-password'
```

### 3. Database

```bash
npx prisma migrate dev
```

### 4. Run

```bash
# Dev server
npm run dev

# In a second terminal: forward Stripe webhooks
stripe listen --forward-to localhost:3000/webhooks/stripe
```

Open [http://localhost:3000](http://localhost:3000) for the store and [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

To preview email templates on port 3001:

```bash
npm run email
```

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Generate the Prisma client and build |
| `npm run vercel-build` | Generate, apply migrations and build (used on Vercel) |
| `npm run start` | Start the production server |
| `npm run lint` | Lint with ESLint |
| `npm run email` | Preview React Email templates |

## Deployment

The project is deployed on Vercel. Set the same environment variables in the Vercel project, use `npm run vercel-build` as the build command so migrations run on deploy, and point a Stripe webhook endpoint at `https://<your-domain>/webhooks/stripe`.

## License

[MIT](LICENSE)

## Author

**Ettore Serra** — Developer & designer

- Portfolio: [ettoreserra.it](https://www.ettoreserra.it)
- GitHub: [@EttoreTheWebisteMaster](https://github.com/EttoreTheWebisteMaster/)
- LinkedIn: [ettore-serra-developer](https://www.linkedin.com/in/ettore-serra-developer/)
- Instagram: [@ett.re](https://www.instagram.com/ett.re/)
