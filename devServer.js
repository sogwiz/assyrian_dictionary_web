var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var MongoClient = require('mongodb').MongoClient

var app = express();
var compiler = webpack(config);
require('dotenv').config();

var port = process.env.PORT || 3001;
var host = process.env.BIND_IP || 'localhost';

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

var connectionString = process.env.DB_CONN_STRING;

//turning this off for production
//app.use(require('webpack-hot-middleware')(compiler));


//app.use(require('prerender-node').set('prerenderToken', 'Oks8UGF2XmKOTxUZQeyz'));

app.set('view engine', 'ejs');

const options = {
  root: __dirname + '/static/',
  headers: {
    'Content-Type': 'text/plain;charset=UTF-8',
  }
};
app.get('/robots.txt', (req, res) => (
  res.status(200).sendFile('robots.txt', options)
));

app.get('/sitemap.xml', (req, res) => (
  res.status(200).sendFile('sitemap.xml', options)
));

app.get('/sitemap2.xml', (req, res) => (
  res.status(200).sendFile('sitemap2.xml', options)
));

//this is just for SEO server side rendering purposes
//doesn't get called on client side search UNLESS the user views page source
app.get('/word/:searchTerm', function(req, res) {
  console.log('sever invoked');
    
    const db = app.locals.db;
    //TODO: there's no reason why this shouldn't be made into just one query.
    //right now, it is 2 queries
    db.collection('DictionaryWordDefinitionList').find({"word":req.params.searchTerm}).limit(1).sort( { boost: -1 } ).toArray(function (err, result) {
      if (err || !result || !result[0]) {
        res.render('index', {title: "word for " + req.params.searchTerm});
        //db.close();
        return
      }
      
      db.collection('DictionaryDefinition').find({"searchkeynum":result[0]['searchkeynum']}).limit(1).toArray(function(err, searchresult){
        if (err || !searchresult || !searchresult[0]) {
          res.render('index', {title: "word for " + req.params.searchTerm});
          //db.close();
          return
        }
        console.log("search result")
        var textToRender = searchresult[0]['east'] + " ( " + searchresult[0]['phonetic'] +" )"
        res.render('index', {title: "word for " + req.params.searchTerm + "  : " + textToRender, word: req.params.searchTerm});
        //db.close();
        return
      })
    })
  

  //res.render('index', {title: req.params.searchTerm});
});

app.get('/proverbs', function(req, res) {
  res.render('index', {title: "proverbs and quotes"});
});

app.get('/phrases', function(req, res) {
  res.render('index', {title: "conversational phrases"});
});

app.get('/trends', function(req, res) {
  res.render('index', {title: "what's trending"});
});

app.get('/searchkey/*', function(req, res) {
  res.render('index', {title: "definition"});
});

function removeDuplicatesBy(keyFn, array) {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

app.get('/api/word/related/:searchTerm', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
    
    app.locals.db.collection('DictionaryWordDefinitionList').find({"$text": {"$search": req.params.searchTerm}}, {score: {"$meta": 'textScore'}}).limit(300).sort({score: {"$meta": 'textScore'}}).toArray(function (err, result) {
    //db.collection('DictionaryWordDefinitionList').find({"word":req.params.searchTerm}).limit(1).sort( { boost: -1 } ).toArray(function (err, result) {
      if (err || !result || !result[0]) {
        console.log("error")
      }else {
        resultArr = removeDuplicatesBy(x => x.word, result);
        res.send(resultArr);
      }
    })
  
  //res.send(JSON.stringify({ a: 1 }, null, 3));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//app.listen(port, host, function(err) {
  MongoClient.connect(connectionString, function (err, db) {
    if (err) {
      //res.send(JSON.stringify({ error: "couldn't connect to db" }, null, 3));
      console.log("couldn't connect to mongo ")
      console.log(err)
      return
    }else {
      app.listen(port, function(error) {
        if (error) {
          console.log(error);
          return;
        }
        app.locals.db = db;
        console.log('Listening at ' + host + ':' + port);
      });
    }
  });
