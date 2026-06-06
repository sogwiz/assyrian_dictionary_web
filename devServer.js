const path = require('path');
const express = require('express');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const webpackConfig = require('./webpack.config.dev');
var MongoClient = require('mongodb').MongoClient
const compression = require('compression')
const mailgun = require('./config/mailgun');
const { emailRateLimiter, translateRateLimiter } = require('./middleware/rateLimit');
const logger = require('./middleware/logger');
const llmFactory = require('./lib/llm');

const os = require('os');
const hostname = os.hostname()

var emailAPIKey = process.env.EMAIL_API_KEY;
var emailDomain = "mg.sargonsays.com";

var queueRequestedWords = [];//queue of requested words to add to dictionary

//const  morgan = require('morgan');

// redis-client.js
const redis = require('redis');
//const redis = require('redis-mock');
const redisClient = redis.createClient(process.env.REDIS_URL);
const DURATION_SECONDS_REDIS_DEFAULT = 720000;

// Translation LLM. Provider + model selected via env (LLM_PROVIDER, LLM_MODEL);
// see lib/llm/index.js. Default: Gemini 2.5 Flash.
const llm = llmFactory.create();
logger.info('LLM provider initialized: ' + llm.name + ' / ' + llm.model);

function buildTranslationPrompt(phrase, wordResults, exclude) {
  var dictionaryContext = wordResults.map(function(wr) {
    if (!wr.results || wr.results.length === 0) {
      return 'Word: "' + wr.word + '"\n  (no dictionary entries found)';
    }
    var entries = wr.results.map(function(item, idx) {
      var def = item.definition || {};
      var east = def.east || '';
      var phonetic = def.phonetic || '';
      var english = def.english || def.english_short || '';
      var partofspeech = def.partofspeech || '';
      var definitionArr = (def.definition_arr || []).slice(0, 2).join('; ');
      return '  Entry ' + (idx + 1) + ': east=' + east + ', phonetic=' + phonetic + ', english=' + english + ', pos=' + partofspeech + (definitionArr ? ', definitions=' + definitionArr : '');
    }).join('\n');
    return 'Word: "' + wr.word + '"\n' + entries;
  }).join('\n\n');

  // When regenerating, instruct the model to avoid prior outputs and produce a
  // genuinely distinct alternative (different word choice, dialect, or phrasing).
  var exclusionInstruction = '';
  if (exclude && exclude.length) {
    exclusionInstruction = '\n\nThe user has already seen the following translation(s) and wants a DIFFERENT alternative. Do NOT repeat any of these — vary the word choice, dialect, register, or phrasing while staying accurate:\n- ' + exclude.join('\n- ') + '\n';
  }

  var optionsInstruction = (exclude && exclude.length)
    ? 'Provide exactly 1 fresh translation option that differs from the ones listed above.'
    : 'Provide 1-2 translation options.';

  return 'You are an expert Assyrian (Syriac/Sureth) language translator. Using the dictionary entries provided below, translate the English phrase into Assyrian. Provide three gender forms for each translation: a default form (the most common or conventional usage when gender is unspecified — typically masculine in Assyrian), plus explicit masculine and feminine forms.\n\nPhrase to translate: "' + phrase + '"\n\nDictionary entries for each word:\n' + dictionaryContext + '\n\nIMPORTANT: The dictionary entries may not include gender markers. Use your knowledge of Assyrian/Syriac grammar to produce correct masculine and feminine verb conjugations. In Eastern Syriac, verbs typically differ between masculine and feminine forms (e.g. masculine ܒܵܥܹܐ vs feminine ܒܵܥܝܵܐ for "want").' + exclusionInstruction + '\n\nRespond with a JSON object in this exact format (no markdown, just raw JSON):\n{\n  "translations": [\n    {\n      "default": {\n        "east": "<Syriac script - default/common form when gender is unspecified>",\n        "phonetic": "<academic transliteration>",\n        "english_phonetic": "<simplified pronunciation guide for English speakers, e.g. ah-nah bah-yeh>"\n      },\n      "masculine": {\n        "east": "<Syriac script - masculine form>",\n        "phonetic": "<academic transliteration>",\n        "english_phonetic": "<simplified pronunciation for English speakers>"\n      },\n      "feminine": {\n        "east": "<Syriac script - feminine form>",\n        "phonetic": "<academic transliteration>",\n        "english_phonetic": "<simplified pronunciation for English speakers>"\n      },\n      "explanation": "<brief explanation of the translation and what differs between the three forms>",\n      "confidence": "<high|medium|low>",\n      "source": "<dictionary-grounded|llm-knowledge>"\n    }\n  ]\n}\n\nUse "dictionary-grounded" as source if the translation is primarily based on the provided dictionary entries, or "llm-knowledge" if you relied on your own knowledge (especially for gender conjugation). ' + optionsInstruction;
}

var app = express();

// Trust the single nginx reverse proxy in front of us so req.ip reflects the
// real client IP (from X-Forwarded-For) instead of the nginx container IP.
// Required for per-IP rate limiting to work correctly. '1' = one proxy hop,
// which avoids the X-Forwarded-For spoofing risk of a permissive 'true'.
app.set('trust proxy', 1);

//compress all responses
app.use(compression())
//app.use(logger.morganInstance); // Morgan HTTP request logger integrated with Winston

const compiler = webpack(webpackConfig);
require('dotenv').config();

var port = process.env.PORT || 3001;
var host = process.env.BIND_IP || 'localhost';

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
app.use(bodyParser.json());

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

app.get('/ads.txt', (req, res) => (
  res.status(200).sendFile('ads.txt', options)
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
  logger.info('server invoked');
    
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
        logger.info("search result")
        var textToRender = searchresult[0]['east'] + " ( " + searchresult[0]['phonetic'] +" )"
        res.render('index', {title: "word for " + req.params.searchTerm + "  : " + textToRender, word: req.params.searchTerm});
        //db.close();
        return
      })
    })
  //res.render('index', {title: req.params.searchTerm});
});

app.get('/api/autosuggest/:searchTerm', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  const redisKey = 'autosuggest/' + req.params.searchTerm

  redisClient.get(redisKey, (err, result) => {
    if (result){
      //logger.info("Reading autosuggest from cache")
      return res.status(200).send(result);
    }else {
      //logger.info("Reading autosuggest from db")
      app.locals.db.collection('DictionaryWordDefinitionList').find({"word":new RegExp('^'+req.params.searchTerm)}).limit(50).sort( { "boost": -1 } ).toArray(function (err, result) {
        if (err || !result || !result[0]) {
          logger.info("error fetching autosuggest" + err)
        } else {
          redisClient.set(redisKey,JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result);
        }
      })
    }
  })
})

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

app.get('/names', function(req, res) {
  res.render('index', {title: "names and meanings"});
});

function removeDuplicatesBy(keyFn, array) {
  var mySet = new Set();
  return array.filter(function(x) {
    var key = keyFn(x), isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

app.get('/api/names', function(req, res) {
  const redisKey = 'names'
  res.setHeader('Content-Type', 'application/json');
  redisClient.get(redisKey, (err, result) => {
    if (result) {
      return res.status(200).send(result);
    } else {
      logger.info('reading names from db')
      app.locals.db.collection('DictionaryDefinition').find({'partofspeech': 'name'}, {'english_short': 1, 'east': 1, 'wordform': 1, 'definition_arr': 1, 'arabic': 1, 'searchkeynum': 1}).sort( {'english_short': 1 } ).toArray(function(err, result) {
        if (err || !result || !result[0]) {
          logger.info("error fetching names" + err)
        } else {
          //TODO: set this back to DURATION_SECONDS_REDIS_DEFAULT
          redisClient.set(redisKey, JSON.stringify(result),'EX',5)
          res.send(result);
        }
      })
    }
  })
})

app.get('/api/proverb', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  redisClient.get('proverbs', (err, result) => {
    if (result){
      return res.status(200).send(result);
    }else {
      logger.info("reading proverbs from db")
      app.locals.db.collection('Proverb').find().toArray(function (err, result) {
        if (err || !result || !result[0]) {
          logger.info("error fetching proverbs" + err)
        }else {
          //logger.info(result, typeof result);
          redisClient.set('proverbs',JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result);
        }
      })
    }
  })
  
});

app.get('/api/roots', function(req, res) {
  const redisKey = 'roots'
  res.setHeader('Content-Type', 'application/json');
  redisClient.get(redisKey, (err, result) => {
    if (result) {
      return res.status(200).send(result);
    } else {
      logger.info('reading roots from db')
      app.locals.db.collection('DictionaryDefinition').find({"partofspeech":{ $eq :"root"}}).sort( { "east": 1 } ).toArray(function (err, result) {
        if (err || !result || !result[0]) {
          logger.info("error fetching roots" + err)
        } else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result);
        }
      })
    }
  })
})

app.get('/api/derived/:root', function(req, res) {
  const redisKey = 'derived/' + req.params.root
  res.setHeader('Content-Type', 'application/json');
  redisClient.get(redisKey, (err, result) => {
    if (result) {
      return res.status(200).send(result);
    } else {
      logger.info('reading derived from db')
      app.locals.db.collection('DictionaryDefinition').find({"root":req.params.root}).sort( { "east": 1 } ).toArray(function (err, result) {
        if (err || !result || !result[0]) {
          logger.info("error fetching derived words" + err)
        } else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result);
        }
      })
    }

  })
})


app.get('/api/phrases', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  redisClient.get('phrases', (err, result) => {
    if (result) {
      return res.status(200).send(result);
    }else {
      logger.info('reading phrases from db')
      app.locals.db.collection('DictionaryDefinition').find({"partofspeech":{ $eq :"phrase"}}).sort( { "english": 1 } ).toArray(function (err, result) {
        if (err || !result || !result[0]) {
          logger.info("error fetching phrases" + err)
        } else {
          redisClient.set('phrases', JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result);
        }
      })
    }

  })
})

app.get('/api/stats/dictionarydefinition', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const redisKey = 'stats/dictionarydefinition'
  redisClient.get(redisKey, (err, result) => {
    if(result) {
      return res.status(200).send(result)
    }else {
      logger.info('reading stats/dictionarydefinition from db')
      app.locals.db.collection('DictionaryDefinition').count().then(result => { 
        redisClient.set(redisKey, JSON.stringify(result), 'EX',DURATION_SECONDS_REDIS_DEFAULT)
                res.send(result)
      }).catch((err) => {
        logger.info("error fetching stats/dictionarydefinition from db")
        logger.info(err)
      })
    }
  })
})

app.get('/api/stats/queries', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const redisKey = 'stats/queries'
  redisClient.get(redisKey, (err, result) => {
    if(result) {
      return res.status(200).send(result)
    }else {
      logger.info('reading stats/queries from db')
      app.locals.db.collection('SearchStat').aggregate([
        {
          $group:
            {
              _id : 1,
              count: { $sum: "$queries" }
            }}]).toArray(function (err, result) { 
              if(err){
                logger.info("error fetching stats/queries from db")
                logger.info(err)
              }else {
                redisClient.set(redisKey, JSON.stringify(result), 'EX',10800)
                res.send(result)
              }
            })
    }

  })

}
)

app.get('/api/searchstats', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const redisKey = 'searchstats'
  redisClient.get(redisKey, (err, result) => {
    if (result) {
      return res.status(200).send(result)
    } else {
      logger.info('reading searchstats from db')
      app.locals.db.collection('SearchStat').find().limit(250).sort({queries:-1}).toArray(function (err, result) {
        if(err){
          logger.info("error fetching searchstats from db ")
          logger.info(err)
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
      logger.info('reading verified from db')
      app.locals.db.collection('DictionaryWordDefinitionList').find({boost: 100}).limit(350).toArray(function (err, result) {
        if(err){
          logger.info("error fetching verified from db ")
          logger.info(err)
        }else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result)
        }
      })
    }
  })

})

app.get('/api/word/search/:searchTerm', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const redisKey = 'word/search/' + req.params.searchTerm

  const useragent = req.header('user-agent')
  var isWebRequest = true;
  //so that we don't log curl requests that prime the cache
  if(useragent && useragent.startsWith("curl")){
    isWebRequest = false;
  }

  
  var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress

  var appendMessage = ":remoteIp:" + ip + ":userAgent:" + useragent
  

  var isEnglish = /^[a-zA-Z0-9]/.test(req.params.searchTerm)
  if(!isEnglish){
    console.log("Assyrian search")
    logger.info(req.params.searchTerm + appendMessage)
    app.locals.db.collection('DictionaryDefinition').find({"$text": {"$search": req.params.searchTerm}}, {score: {"$meta": 'textScore'}}).limit(300).sort({score: {"$meta": 'textScore'}}).toArray(function (err, result) {
      if (err || !result || !result[0]) {
        logger.info("error fetching Assyrian search results " + err)
        //for some reason, this line must not be deleted
        res.send(result);
      }else{
        var output = []
        
        var index;
        for (index=0; index<result.length; index++){
          var item = result[index];
          
          output.push({
            "_id":item["searchkeynum"],
            "word":"",
            "boost":0,
            "searchkeynum":item["searchkeynum"],
            "definition":item
          }
          );
        }
        res.send(output);
      }
      
    })
  }
  else{
    redisClient.get(redisKey, (err, result) => {
      if (result) {
        if(isWebRequest)logger.info(':CACHE:SearchResult:'+req.params.searchTerm + appendMessage)
        return res.status(200).send(result);
      }else {
        if(isWebRequest)logger.info(':DB:SearchResult:'+req.params.searchTerm + appendMessage)
          app.locals.db.collection('DictionaryWordDefinitionList').aggregate([
            { $match: { word: { $eq: req.params.searchTerm }}},
            { $limit : 50},
            { $sort : { "boost": -1 }},
            {
              $lookup:
                {
                  from: "DictionaryDefinition",
                  localField: "dictionary_definition",
                  foreignField: "_id",
                  as: "definition"
                }
           },
          {"$unwind":"$definition"}
        ]).toArray(function (err, result) {
          if (err || !result || !result[0]) {
            logger.info("error fetching search results " + err)
            //for some reason, this line must not be deleted
            res.send(result);
          } else {
            redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
            res.send(result);
          }
        })
      }
  
    })
  }
})


// used by the popup modal when showing the tag cloud "Related Searches"
app.get('/api/searchkeynum/related/:searchkeynum', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const redisKey = 'searchkeynum/related/' + req.params.searchkeynum

  redisClient.get(redisKey, (err, result) => {
    if(result) {
      return res.status(200).send(result);
    }else {
      logger.info('reading /api/searchkeynum/related from db')
      app.locals.db.collection('DictionaryWordDefinitionList').find({'searchkeynum': parseInt(req.params.searchkeynum)}).limit(30).sort({boost:-1}).toArray(function(err, result) {
        if (err || !result || !result[0]) {
          logger.info("Couldn't find related searchkeynum from db " +  req.params.searchkeynum)
          logger.info(err)
        }else {
          redisClient.set(redisKey, JSON.stringify(result),'EX',DURATION_SECONDS_REDIS_DEFAULT)
          res.send(result)
        }
      })
    }
  })
})

app.post('/api/word/request/:searchTerm', emailRateLimiter, function(req, res) {
  res.setHeader('Content-Type', 'application/json')

  console.log("/api/word/request/:", req.params.searchTerm + " : " + req.body.email)

  var recipients = "assyrian-app-dictionary@googlegroups.com";
  if(req.body.email && req.body.email !==""){
      recipients += ", "+req.body.email;
  }

  var searchTerm = req.params.searchTerm.trim();
  if(searchTerm.length>155){
    searchTerm = searchTerm.substring(0,154)
  }

  if(queueRequestedWords.includes(searchTerm)){
    res.status(429).send("Word already submitted")
    return
  }else{
    queueRequestedWords.push(searchTerm)
    if(queueRequestedWords.length>20){
      queueRequestedWords.shift();//remove the oldest item
    }
  }

  const mailgunClient = mailgun;

  const data = {
    from: mailgunClient.emailFrom,
    to: recipients,
    subject: "Translation Request : " + searchTerm,
    html:  "Translation Request Submitted via <a href='sargonsays.com'>sargonsays.com</a> site: " + searchTerm
  }
  
  mailgunClient.messages().send(data, function (err, body) {
    //If there is an error, render the error page
    if (err) {
        //res.render('error', { error : err});
        console.log("got an error: ", err);
    }
    //Else we can greet    and leave
    else {
        //We pass the variable "email" from the url parameter in an object rendered by Jade
        //res.render('submitted', { email : req.params.mail });
        console.log(body);
    }
  })  
  
    res.sendStatus(200)
})

app.put('/api/cache/del/:searchTerm', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  const redisKey = 'word/search/' + req.params.searchTerm
  redisClient.del(redisKey, function(err, response){
    console.log("Redis Del", response)
    if(response == 1){
      res.sendStatus(200)
    }else{
      res.sendStatus(500)
    }
    //res.send(response)
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
      logger.info('reading /api/searchkeynum from db')
      app.locals.db.collection('DictionaryDefinition').find({'searchkeynum': parseInt(req.params.searchkeynum)}).toArray(function(err, result) {
        if (err || !result || !result[0]) {
          logger.info("Couldn't find DictionaryDefinition searchkeynum from db " +  req.params.searchkeynum)
          logger.info(err)
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
        logger.info('reading api/word/related from db')
        //db.collection('DictionaryWordDefinitionList').find({"word":req.params.searchTerm}).limit(1).sort( { boost: -1 } ).toArray(function (err, result) {
          if (err || !result || !result[0]) {
            logger.info("error")
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

var STOP_WORDS = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither', 'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also']);
var MAX_PHRASE_LENGTH = 500;
var MAX_WORD_COUNT = 20;

app.post('/api/translate', translateRateLimiter, function(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const text = req.body && req.body.text;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).send(JSON.stringify({ error: 'text is required' }));
  }

  if (text.length > MAX_PHRASE_LENGTH) {
    return res.status(400).send(JSON.stringify({ error: 'text too long (max ' + MAX_PHRASE_LENGTH + ' characters)' }));
  }

  const words = text.split(/\s+/).map(function(w) { return w.toLowerCase().trim(); }).filter(Boolean);

  if (words.length === 0) {
    return res.status(400).send(JSON.stringify({ error: 'text contains no words' }));
  }

  if (words.length > MAX_WORD_COUNT) {
    return res.status(400).send(JSON.stringify({ error: 'text has too many words (max ' + MAX_WORD_COUNT + ')' }));
  }

  // Optional regeneration controls: prior outputs to avoid + a flag that raises
  // temperature so "Show another" yields a genuinely different alternative.
  var exclude = [];
  if (req.body && Array.isArray(req.body.exclude)) {
    exclude = req.body.exclude
      .filter(function(s) { return typeof s === 'string' && s.trim(); })
      .slice(0, 8); // cap so the prompt stays bounded
  }
  var isVariant = !!(req.body && req.body.variant) || exclude.length > 0;

  // Cache key: v1 prefix + normalized phrase (lowercase, collapsed whitespace)
  var normalizedPhrase = text.toLowerCase().replace(/\s+/g, ' ').trim();
  var cacheKey = 'v1:translate/' + normalizedPhrase;

  // Variant requests bypass cache — they need fresh LLM output
  if (!isVariant) {
    redisClient.get(cacheKey, function(err, cached) {
      if (!err && cached) {
        try {
          var cachedResponse = JSON.parse(cached);
          logger.info('TRANSLATE_COST ' + JSON.stringify({
            provider: llm.name,
            model: llm.model,
            words: words.length,
            lookupWords: 0,
            promptTokens: 0,
            outputTokens: 0,
            thoughtTokens: 0,
            totalTokens: 0,
            estCostUsd: 0,
            latencyMs: 0,
            variant: false,
            cached: true
          }));
          return res.send(cachedResponse);
        } catch (parseErr) {
          // Cache corrupted, fall through to fresh fetch
        }
      }
      executeTranslation();
    });
  } else {
    executeTranslation();
  }

  function executeTranslation() {
    var lookupWords = words.filter(function(w) { return !STOP_WORDS.has(w); });

    app.locals.db.collection('DictionaryWordDefinitionList').aggregate([
    { $match: { word: { $in: lookupWords } } },
    { $sort: { boost: -1 } },
    {
      $lookup: {
        from: 'DictionaryDefinition',
        localField: 'dictionary_definition',
        foreignField: '_id',
        as: 'definition'
      }
    },
    { $unwind: '$definition' }
  ]).toArray(function(err, result) {
    if (err) {
      logger.info('error fetching translate results ' + err);
      return res.status(500).send(JSON.stringify({ error: 'database error' }));
    }

    // Group results by word, keeping top 3 per word (only for non-stop-words)
    var wordMap = {};
    lookupWords.forEach(function(w) { wordMap[w] = []; });

    (result || []).forEach(function(item) {
      var w = item.word;
      if (wordMap[w] && wordMap[w].length < 3) {
        wordMap[w].push(item);
      }
    });

    var wordResults = lookupWords.map(function(w) {
      return { word: w, results: wordMap[w] };
    });

    // Call the configured LLM with the dictionary-grounded prompt. Variants
    // run hotter so the alternative meaningfully differs from what the user
    // already saw.
    var prompt = buildTranslationPrompt(text, wordResults, exclude);
    var startedAt = Date.now();
    llm.generate({ prompt: prompt, temperature: isVariant ? 0.95 : 0.6 }).then(function(llmResponse) {
      var translations = [];
      try {
        var rawText = llmResponse.text || '';
        var jsonMatch = rawText.match(/\{[\s\S]*\}/);
        var jsonStr = jsonMatch ? jsonMatch[0] : rawText;
        var parsed = JSON.parse(jsonStr);
        translations = parsed.translations || [];
      } catch (parseErr) {
        logger.info('error parsing LLM response: ' + parseErr);
      }

      // --- Cost accounting: log per-request token usage + estimated cost ---
      var usage = llmResponse.usage || {};
      var cost = llmResponse.cost || { totalUsd: 0 };
      logger.info('TRANSLATE_COST ' + JSON.stringify({
        provider: llm.name,
        model: llm.model,
        words: words.length,
        lookupWords: lookupWords.length,
        promptTokens: usage.promptTokens || 0,
        outputTokens: usage.outputTokens || 0,
        thoughtTokens: usage.thoughtTokens || 0,
        totalTokens: usage.totalTokens || 0,
        estCostUsd: Number(cost.totalUsd.toFixed(6)),
        latencyMs: Date.now() - startedAt,
        variant: isVariant,
        cached: false
      }));

      var response = {
        text: text,
        translations: translations,
        wordResults: wordResults,
        usage: {
          provider: llm.name,
          model: llm.model,
          promptTokens: usage.promptTokens || 0,
          outputTokens: usage.outputTokens || 0,
          thoughtTokens: usage.thoughtTokens || 0,
          totalTokens: usage.totalTokens || 0,
          estCostUsd: Number(cost.totalUsd.toFixed(6))
        }
      };

      // Cache successful base translations (not variants, not errors)
      if (!isVariant && translations.length > 0) {
        redisClient.set(cacheKey, JSON.stringify(response), 'EX', DURATION_SECONDS_REDIS_DEFAULT);
      }

      res.send(response);
    }).catch(function(llmErr) {
      console.error('LLM call failed:', llmErr);
      logger.info('LLM call failed: ' + (llmErr.message || llmErr));
      res.send({ text: text, translations: [], wordResults: wordResults, error: 'Translation unavailable' });
    });
  });
  } // end executeTranslation
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//app.listen(port, host, function(err) {
  MongoClient.connect(connectionString, function (err, db) {
    if (err) {
      //res.send(JSON.stringify({ error: "couldn't connect to db" }, null, 3));
      logger.info("couldn't connect to mongo ")
      logger.info(err)
      return
    }else {
      app.listen(port, function(error) {
        if (error) {
          logger.info(error);
          return;
        }
        app.locals.db = db;
        logger.info('Listening at ' + host + ':' + port);
      });
    }
  });