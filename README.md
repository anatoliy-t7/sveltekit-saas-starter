# SvelteKit SaaS starter

### Stack

- [SvelteKit (JS)](https://kit.svelte.dev)
- [Svelte (JS)](https://svelte.dev)
- [Tailwind (CSS)](https://tailwindcss.com)
- [Prisma (ORM)](https://www.prisma.io)

### Packages included

- [Skeleton (UI)](https://www.skeleton.dev)
- [Lucia (Auth)](https://www.skeleton.dev)
- [Sveltekit-Superforms](https://superforms.rocks/)
- [Tabler Icons](https://tabler-icons.io/)
- and etc

### Auth ready

- OTP via Email
- Google
- Facebook

## Development mode

First, run the dev server

```sh
npm run dev
```

Then, tell Stripe to tunnel webhooks to the local dev server:

```sh
stripe listen --forward-to localhost:5173/webhooks/stripe
```

  <br/>
  <br/>
  <br/>

<a href="https://www.buymeacoffee.com/rHcLDkY" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 200px !important;" ></a>
