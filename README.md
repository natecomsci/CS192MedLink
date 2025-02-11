# CS 192: Med Link
This is a course requirement for CS 191/CS192 Software Engineering Courses of the Department of Computer Science, College of Engineering, University of the Philippines, Diliman 
under the guidance of Prof. Ma. Rowena C. Solamo for the AY 2024-2025.

## Development Team:
- Adrianne Paul Abyado
- Eisenhower II Aldemita
- Nathaniel Feliciano
- Judelle Clareese Gaza
- Jordan Neil Sta Maria

# To run locally
- `git clone` the repo
- `cd` to the repo
- `npm install` to install the dependencies
- `npx prisma studio` to run the database; this should open a localhost:5555 tab
- `npm run dev` or `npm run dev -- --open` to run the actual web app

> In case of errors, run `npm install` then rerun command

# Production version
- `npm run build` to build a production version
- `npm run preview` to preview the production build
> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Dependency Guides:
- Svelte https://svelte.dev/docs/svelte/overview
- SvelteKit https://svelte.dev/docs/kit/introduction
- Prisma https://www.prisma.io/docs
- TailwindCSS https://tailwindcss.com/docs/installation/framework-guides/sveltekit