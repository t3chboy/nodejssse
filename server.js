let http = require("http");
const path = require('path');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.json());
const layout = require('express-layout')
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');

const cheerio = require('cheerio');
const fetchdata = require('./fetch_data');

//start session
  app.use(session({
    secret : 'myasycrequestapp',
    saveUninitialized : true,
    resave : false
  })
  )

 
// Running Server Details.
let server = app.listen( 8081, function () {
  let host = server.address().address
  let port = server.address().port
  console.log("App listening at %s:%s Port", host, port);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.get('/',function (req,res){
  res.render('streamform');
}); 
 
app.post('/stream', function (req, res) {
   
   if (!req.session.urls) {
    req.session.urls = {}
  }
  req.session.urls = req.body
  req.session.urlsCount = Object.keys(req.session.urls).length;

  if( Object.keys(req.session.urls).length > 0 ){
    res.status(200).json({ streamStatus: true });
  }
});
console.time('100-elements');
app.get('/datastream',  function( req, res ){
 
  res.status( 200 ).set({
    "cache-control" : "no-cahce",
    "content-Type" : "text/event-stream"
  });

  let fetchedUrl = 0;
  let totalUrls =  req.session.urlsCount;
  console.log(totalUrls);
  Object.keys(req.session.urls).forEach(function(key) {      
      

    fetchdata( req.session.urls[key] )
    .then((res) => {
      return res.text();
    }).then((data) =>{
       fetchedUrl++;
        let $ = cheerio.load(data);
        let title = $("title").text();
        
        res.write("data:"+title+"\n\n");
          
          if( fetchedUrl == totalUrls ){
            res.write("data:END\n\n");    
          }
      }).catch( (err) =>{
        fetchedUrl++;
       res.write("data:Error\n\n");
        if( fetchedUrl == totalUrls ){
            res.write("data:END\n\n");    
        }
    })
  
  });
  
  const used = process.memoryUsage();
    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
});




