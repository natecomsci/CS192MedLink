// import forms from '@tailwindcss/forms';

// export default {
// 	plugins: [
// 		forms,
// 	],
// };

// const config = {
//   content: [
//        // more lines
//         "./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}",
//     ],
//     // more lines
// }  ;

import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{svelte,html,js,ts}",
    "../node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [forms],
};

export default config;
