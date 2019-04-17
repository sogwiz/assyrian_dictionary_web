var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var MongoClient = require('mongodb').MongoClient
var compression = require('compression')

// redis-client.js
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL);
const DURATION_SECONDS_REDIS_DEFAULT = 36000

var app = express();
//compress all responses
app.use(compression())
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

app.get('/api/proverb', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  redisClient.get('proverbs', (err, result) => {
    if (result){
      return res.status(200).send(result);
    }else {
      console.log("reading proverbs from db")
      app.locals.db.collection('Proverb').find().toArray(function (err, result) {
        if (err || !result || !result[0]) {
          console.log("error fetching proverbs" + err)
        }else {
          //console.log(result, typeof result);
          redisClient.set('proverbs',JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result);
        }
      })
    }
  })
  
});

app.get('/api/phrases', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  redisClient.get('phrases', (err, result) => {
    if (result) {
      return res.status(200).send(result);
    }else {
      console.log('reading phrases from db')
      app.locals.db.collection('DictionaryDefinition').find({"partofspeech":{ $eq :"phrase"}}).sort( { "english": 1 } ).toArray(function (err, result) {
        if (err || !result || !result[0]) {
          console.log("error fetching phrases" + err)
        } else {
          redisClient.set('phrases', JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result);
        }
      })
    }

  })
})

app.get('/api/searchstats', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const redisKey = 'searchstats'
  redisClient.get(redisKey, (err, result) => {
    if (result) {
      return res.status(200).send(result)
    } else {
      console.log('reading searchstats from db')
      app.locals.db.collection('SearchStat').find().limit(250).sort({queries:-1}).toArray(function (err, result) {
        if(err){
          console.log("error fetching searchstats from db ")
          console.log(err)
        }else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',10800)
          res.send(result)
        }
      })
    }
  })
})

app.get('/api/verified', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const redisKey = 'verified'

  redisClient.get(redisKey, (err, result) => {
    if (result) {
      return res.status(200).send(result)
    } else {
      console.log('reading verified from db')
      app.locals.db.collection('DictionaryWordDefinitionList').find({boost: 100}).limit(350).toArray(function (err, result) {
        if(err){
          console.log("error fetching verified from db ")
          console.log(err)
        }else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result)
        }
      })
    }
  })

})

// used by the popup modal when showing the tag cloud "Related Searches"
app.get('/api/searchkeynum/related/:searchkeynum', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const redisKey = 'searchkeynum/related/' + req.params.searchkeynum

  redisClient.get(redisKey, (err, result) => {
    if(result) {
      return res.status(200).send(result);
    }else {
      console.log('reading /api/searchkeynum/related from db')
      app.locals.db.collection('DictionaryWordDefinitionList').find({'searchkeynum': parseInt(req.params.searchkeynum)}).limit(30).sort({boost:-1}).toArray(function(err, result) {
        if (err || !result || !result[0]) {
          console.log("Couldn't find related searchkeynum from db " +  req.params.searchkeynum)
          console.log(err)
        }else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result)
        }
      })
    }
  })
})

// used in the searchkeynum detail page via TodoDetail.js (sargonsays.com/searchkey/53064)
app.get('/api/searchkeynum/:searchkeynum', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const redisKey = 'searchkeynum/' + req.params.searchkeynum

  redisClient.get(redisKey, (err, result) => {
    if(result) {
      return res.status(200).send(result);
    }else {
      console.log('reading /api/searchkeynum from db')
      app.locals.db.collection('DictionaryDefinition').find({'searchkeynum': parseInt(req.params.searchkeynum)}).toArray(function(err, result) {
        if (err || !result || !result[0]) {
          console.log("Couldn't find DictionaryDefinition searchkeynum from db " +  req.params.searchkeynum)
          console.log(err)
        }else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result)
        }
      })
    }
  })


})


// used after a user performs a search. this is the bottom of the page "Searches related to"
app.get('/api/word/related/:searchTerm', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const redisKey = 'word/related/' + req.params.searchTerm
  redisClient.get(redisKey, (err, result) => {
    if(result) {
      return res.status(200).send(result);
    }else {
      app.locals.db.collection('DictionaryWordDefinitionList').find({"$text": {"$search": req.params.searchTerm}}, {score: {"$meta": 'textScore'}}).limit(300).sort({score: {"$meta": 'textScore'}}).toArray(function (err, result) {
        console.log('reading api/word/related from db')
        //db.collection('DictionaryWordDefinitionList').find({"word":req.params.searchTerm}).limit(1).sort( { boost: -1 } ).toArray(function (err, result) {
          if (err || !result || !result[0]) {
            console.log("error")
          }else {
            resultArr = removeDuplicatesBy(x => x.word, result);
            redisClient.set(redisKey, JSON.stringify(resultArr),'EX',DURATION_SECONDS_REDIS_DEFAULT)
            res.send(resultArr);
          }
        })
    }
  })
  // res.send(JSON.stringify({ a: 1 }, null, 3));
})

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

