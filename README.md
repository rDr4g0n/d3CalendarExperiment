Webapp Boilerplate 3
-------------------------
Part 3 of the hit series "Webapp Boilerplate"!

Features
------------------------
* Web
* App
* Boilerplate

Prereqs
----------------------
First, decide you want to build a webapp. Once you're done with that, decide if you are going to use linux and make. If you're still here then I guess this is for you. You need:

* 'nix box (or VM I guess)
* make
* [nodejs 6+](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) or greater
* [yarn](https://yarnpkg.com/en/docs/install)

To install build dependencies `yarn install`, and you're all set!

Usage
-----------------------
* `make build` (or simply `make`) will build all the js, css, html and copy it to the `build` directory.
* `make serve` to serve up the `build` directory (on all interfaces, port 8080 by default).
* `make watch` to build js, css, html on the fly as files change, serve them up, and create a livereload server.
* `make clean` does the usual.

More informations
----------------------
JavaScript is built using ES6 `import` statements and `rollup` to bundle them together. `src/app.js` is the default entrypoint. Add more rules as needed for more bundles, and then include them script tags in `src/index.html`

CSS is simply concatenated together. all of `src` is searched for css files, so if you prefer to put your css right next to your js, you good.

Finally, `src/index.html` is merely copied over into the build directory. In fact, everything ends up in `build`. 

Also don't forget to edit a few easy-to-miss thingies:

* `README.md` (this file) probably needs an update
* `package.json` has a few fields you want to update: "name", "version", "description", and "author".
* in `src/index.html`, dont forget to update the `<title>` tag.

TODO
---------------------
would be nice

* babel
* sass
