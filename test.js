const fetchdata = require('./fetch_data');
let express = require('express');
let app = express();
let fs = require('fs');
let lineReader = require('line-reader');
const cheerio = require('cheerio');

let server = app.listen( 8082, function () {
  let host = server.address().address
  let port = server.address().port
  console.log("Test app listening at %s:%s Port", host, port);
});

app.get('/datastream',  function( req, res ){

	
    
  lineReader.eachLine('file.txt', function(line, last) {
  	console.log(line);
   fetchdata(  line  )
    .then((res) => {
      return res.text();
    }).then((data) =>{
        let $ = cheerio.load(data);
        let title = $("title").text();
        
        console.log( title );
        res.status(200).end();
      }).catch( (err) =>{
        console.log( err )
        res.status(404).end();	
    });

  })
});

 const used = process.memoryUsage();
    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }