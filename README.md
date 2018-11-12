# Sargonsays English to Assyrian Dictionary web frontend #

English to Assyrian dictionary [*sargonsays.com*](http://sargonsays.com) , made with ReactJS and ParseReact

## Setup

### Install npm project dependencies
```
npm install
```
### Create *.env* file with the following variables or set an environment variable

DB_CONN_STRING=mongodb://{user}:{psswd}@{host}:{port}/assyrian?ssl=true

REACT_PARSE_APP_ID={app_id} 

REACT_PARSE_JS_KEY={js_key}

#### Run locally

```
npm run start
```

It will setup a server with live reload on `localhost:3000`. Live reloading is for both javascript and styles.

#### Run linter

```
npm run lint
```

Will output eventually code mistakes

#### Build the code

```
npm run build
```

This code will bundle both `javascript` and `styles` to `dist/` folder, generating an `index.html` which will point to a `bundle.js` and `bundle.css`.

## What's inside ?
- Webpack
- Babel
- [React transform boilerplate](https://github.com/gaearon/react-transform-boilerplate)
   - Hot reloading
   - Error catching
- [Parse React](https://github.com/ParsePlatform/ParseReact)
- Sass or Less
- [Eslint](http://eslint.org/)
- [React Router](https://github.com/rackt/react-router)


