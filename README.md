# Skeleton

A simple static-site generator using Handlebars templating.

### Version
1.0.0

### Tech

This is what this skeleton is packing:

* [Gulp](//gulp.js) - the streaming build system that manages *everything* below.
* [Handlebars](http://handlebarsjs.com/) - The main templating engine
* [Sass](http://sass-lang.com/) - For powerful & manageable CSS
* [Babel](https://babeljs.io/) - To write ES6 code today
* [Browserify](http://browserify.org/) - To encourage JS modularization
* [LiveReload](http://livereload.com/) - Because like all good developers, I am lazy.
* [Gulp-SFTP](https://www.npmjs.com/package/gulp-sftp) - For deployment, easily configurable.
* [jQuery](//jquery.com) - I'm already writing ES6 code. Might as well go H.A.M.
* [GreenSock](https://greensock.com/) - My favorite animation library.
* [MinCSS](http://mincss.com/) - An insanely small CSS framework that's easy to override.

### Installation

You need Gulp installed globally:

```sh
$ npm install -g gulp
```

```sh
$ git clone git@gitlab.com:Poeticode/Skeleton.git [app_name]
$ cd [app_name]
$ npm install
```

### Development

##### LiveReload:

* Install the [LiveReload Chrome plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).
* In chrome://extensions/, check `Allow access to File URLs` for LiveReload.
* Go to your local site and toggle on the LiveReload Chrome plugin.

```sh
$ gulp watch
```

Any changes in `_src/` will be built & delivered to `dist/`, which in turn is live reloaded to your local site!

##### SFTP Upload:

* Create `.ftppass` at the root of your folder
* Enter your credentials.
* Modify the **upload** task in `gulpfile.js` to use those credentials.
* [Gulp-SFTP](https://www.npmjs.com/package/gulp-sftp) has examples at the bottom.

```sh
$ gulp upload
```

Everything in `dist/` should be uploaded to your server!

### Todos

 - Write Tests
 - Maybe replace Handlebars and make it dynamic with an awesome CMS.

License
----

MIT