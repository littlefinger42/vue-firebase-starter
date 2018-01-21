<h1 align="center">Map App</h1>

<p align="center">
Progressive Web App (PWA) using vue/vuex/vue(x)-router/offline-plugin, with sass, prerendering, vuetify, and firebase/firebaseui! Uses OpenLayers 3 for the map and reads/writes data with firebase storage.
</p>


## Features

Everything in `vue-cli:webpack` (hot reloading/vue file/webpack2/eslint/postcss+sass+stylus+less/...), plus:

<!--TODO: add emoji and links and descriptions-->

- vue / vuex / vue-router / vuex-router-sync
- firebase
- vuexfire
- firebaseui
- vuetify
- Offline Ready, Progressive Web App (PWA)
- prerendering for better SEO
<!--TODO - tracking library with offline support-->

## Build Commands

``` bash
# install dependencies
yarn # or `npm install`

# serve with hot reload at localhost:8080
yarn dev # or `npm run dev`

# build for production with minification and prerendering
yarn build # or `npm run build`

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
yarn run unit # or `npm run unit`

# run e2e tests
yarn run e2e # or `npm run e2e`

# run all tests
yarn test # or `npm test`
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Folder Structure

The folder structure is basically the same as `vue-cli`'s `webpack` template.

[Check the folder structure of the docs here.](http://vuejs-templates.github.io/webpack/structure.html)

```
├── build           # webpack config files
├── config          # project config (mainly used by webpack)
├── dist            # production bundled files when `npm run build`
├── node_modules    # npm dependencies
├── src             # the main src folder, see below for detail
├── static          # pure static assets (directly copied)
├── test            # unit tests and e2e tests
├── index.html      # the index.html template, used by html-webpack-plugin
└── package.json    # package info, build scripts and npm dependencies
```

```
src
├── assets              # module assets (processed by webpack)
├── components          # ui components
├── router              # vue-router routes
├── sass                # sass styles, _variables and _mixins
├── store               # vuex setting, store and modules
├── views               # also called `containers`, see below
├── App.vue             # main app component
├── initFirebase.js     # firebase settings, put your apiKeys here
├── main.js             # the entry point
├── muse-ui-theme.less  # muse-ui theme settings
└── pwa.js              # progressive web app (offline-plugin) runtime
```

To understand the difference between `components` and `views` (or `containers`), check out [this article](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) by redux author [Dan Abramov (@gaearon)](https://github.com/gaearon).

You can rename the `views` to `containers` if you prefer : )

## Development

### Webpack Settings

#### Globals Variables

##### `__DEV__`
There is a `__DEV__` variable that is defined by webpack, and will be replaced during compile time.
Therefore, you can use this in your code to separate debug code and production code.

For example, this

```js
if (__DEV__) {
  window.firebase = firebase
}
```

will make window.firebase available during development for easier debugging, but will be trimmed out when building for produciton.

#### Aliases

##### `@` = `src`

When importing, the `@` sign is aliased to `src` directory, so no need to use `../../../` in nested directories anymore, just use `@/store`, `@/components`, etc.

#### Static folder path

Different from the [default settings of vue-cli webpack template](https://vuejs-templates.github.io/webpack/static.html), I changed the `assetsSubDirectory` from `'static'` to `''`.
This means that everything you put in the `static/*` folder will be copied to the root of `dist/*`, instead of `dist/static/*`.

I did this because Netlify's `_redirects` needs to be in the root of the published directory `dist/`, see the following `Deploy/Netlify` section for more info.

### Progressive Web App (PWA)

**The offline-plugin is only used in production build.**

Thanks to the awesome [offline-plugin](https://github.com/NekR/offline-plugin), vue-firebase-starter is offline ready! It uses ServiceWorker and fallbacks to AppCache to cache webpack output assets (or other assets if specified).

[To understand the life-cycle of ServiceWorker and how it is updated, check out this awesome video.](https://youtu.be/TF4AB75PyIc)

For more information, [check out offline-plugin's docs](https://github.com/NekR/offline-plugin/#docs).

<!--TODO: explain `externals` and AppCache's FALLBACK page.-->

### Prerendering

vue-firebase-starter uses [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) to prerender html when building for production.

Because prerender will generate rendered DOM into html, and vue needs to be able to take control after, [make sure the root component has the same id as the element it's replacing](https://github.com/chrisvfritz/prerender-spa-plugin#caveats).


## Deployment

### favicon

I recommend http://realfavicongenerator.net/, the best favicon generator I've used!

Just follow the instruction and put the extracted files in the `static/` folder, and override the `<head></head>` section in `index.html`.
