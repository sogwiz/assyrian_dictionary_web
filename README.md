# Sargonsays English to Assyrian Dictionary web frontend #

English to Assyrian dictionary [*sargonsays.com*](http://sargonsays.com) , frontend made with ReactJS and API with Express. *To run this app locally*, it is highly recommended to use the Docker Compose approach as new dependencies like redis have been added.

## Setup

### Docker Compose

This will stand up a local development environment with a seeded database and frontend code. App will be running on localhost:80

```
docker-compose -f docker-compose-dev.yaml up --build --scale web=2
```

### Docker
To run via docker. In this example, you'll be able to open a local web browser to localhost:80
```
docker run --restart always -e DB_CONN_STRING='DB_CONN_STR' -e REACT_PARSE_APP_ID=REACT_PARSE_ID -e REACT_PARSE_JS_KEY=REACT_PARSE_JS_KEY -e REACT_PARSE_SERVER=https://assyrian-433.nodechef.com/parse -p 80:3001 -d sogwiz/sargonsays 
```

Docker example via env file
```
docker run --env-file ./.env -p 80:3001 -d sogwiz/sargonsays
```

Docker example via Azure Container Instances ACI
See azure/README.md


## Via NPM

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

#### Build the code

```
npm run build
```

This code will bundle both `javascript` and `styles` to `dist/` folder, generating an `index.html` which will point to a `bundle.js` and `bundle.css`.

## What's inside ?
- Webpack
- ExpressJS for rest API, routing, and EJS templating views (primarily to provide server side url preview for social media preview shares and seo)
- Babel
- [React transform boilerplate](https://github.com/gaearon/react-transform-boilerplate)
   - Hot reloading
   - Error catching
- [Parse React](https://github.com/ParsePlatform/ParseReact)
- Sass or Less
- [Eslint](http://eslint.org/)
- [React Router](https://github.com/rackt/react-router)

# data
we need to reference the objectid by creating a new field that only has the id string and then doing dblookup
this will need us to modify many scripts
- data gen script (or maybe we just have a cloud function do this?)
- the seeded db data also needs this change

CID=`docker ps | grep node | awk '{ print $1 }'` && docker exec -it $CID /bin/bash

# fluentd
- to build the fluentd container that sends logs to elasticsearch
```
docker build -f Dockerfile_fluentd -t sogwiz/sargonsays-custom-fluentd ./
docker push sogwiz/sargonsays-custom-fluentd
```

- to run the fluentd container, run the following command:
```
docker run --rm -d --name custom-docker-fluent-logger -v $(pwd):/fluentd/log sogwiz/sargonsays-custom-fluentd -c /fluentd/log/fluentd.conf
```


# redis
docker exec -it container-name redis-cli FLUSHALL