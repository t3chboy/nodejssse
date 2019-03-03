const fetch = require('node-fetch');

const fetchData = function( url ){
	
	console.log('fetching for => ',url);
  return fetch( url ,{
        headers: { 'Accept': 'text/html; charset=utf-8' },
        compress: false,
        redirect: 'follow',
        follow: 10, 
    });

}

module.exports =  fetchData;