# CS 192: Med Link
This is a course requirement for CS 191/CS192 Software Engineering Courses of the Department of Computer Science, College of Engineering, University of the Philippines, Diliman 
under the guidance of Prof. Ma. Rowena C. Solamo for the AY 2024-2025.

## Development Team:
- Adrianne Paul Abyado
- Eisenhower II Aldemita
- Nathaniel Feliciano
- Judelle Clareese Gaza
- Jordan Neil Sta Maria

# Dependencies Guides:
- Patient Side
	- React Native https://reactnative.dev/docs/set-up-your-environment
	- NativeWind https://blog.logrocket.com/getting-started-nativewind-tailwind-react-native/
	
- Facility Side
	- SvelteKit https://svelte.dev/docs/kit/creating-a-project
	- TailwindCSS https://tailwindcss.com/docs/installation/framework-guides/sveltekit

# To run
## React Native
- Navigate to patientSide directory
- Run either of the following commands
```
npm run android
npm run ios
npm run web
```

## SvelteKit
- Navigate to facilitySide directory
- Run ```npm run dev``` or ```npm run dev -- --open```
- To create a production version of the app, run ```npm run build```
- To preview the production build, run ```npm run preview```
> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# In case of errors
- Run ```npm install``` inside the directory with the error then rerun command
