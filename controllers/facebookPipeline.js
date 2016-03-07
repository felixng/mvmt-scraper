var FB = require('fb');

var config = {
	columns: ['id', 'name', 'about'],
	client_id: '1584642161826737',
	client_secret: 'ba483f4532ef9d6ad76c4e67db9b50ce'
}
module.exports = {
	facebookStart: function (){
		FB.api('oauth/access_token', {
				client_id: config.client_id,
				client_secret: config.client_secret,
				grant_type: 'client_credentials'
			}, function (response) {
				if(!response || response.error) {
					console.log(!response ? 'error occurred' : response.error);
					return;
				}
				accessToken = response.access_token;
				FB.setAccessToken(accessToken);

				pingAPI();
			});
	}
};

/* var getAccessToken = function(){
	FB.api('oauth/access_token', {
				client_id: config.client_id,
				client_secret: config.client_secret,
				grant_type: 'client_credentials'
			}, function (response) {
				if(!response || response.error) {
					console.log(!response ? 'error occurred' : response.error);
					return;
				}
				accessToken = response.access_token;
				FB.setAccessToken(accessToken);
			})
} */

var pingAPI = function(){
	var pg = require('pg');
	var conString = "postgres://postgres:01478520@localhost/mvmt";
	var client = new pg.Client(conString);
	
	client.connect(function(err) {
	  if(err) {
		return console.error('could not connect to postgres', err);
	  }
	  client.query("SELECT * FROM public.resources where trim(facebook) != '';", function(err, result) {
		if(err) {
		  return console.error('error running query', err);
		}
		
		result.rows.forEach(function(entry) {
			//ping facebook
			var query = '/' + entry.facebook;
			
			FB.api(query, { fields: config.columns }, function (response) {
			  if(!response || response.error) {
			   console.log(!response ? 'error occurred' : response.error);
			   return;
			  }
			  checkAndUpdate(entry,response);
			  //console.log(response);
			});
		});
		
		client.end();
	  });
	});
}

var checkAndUpdate = function(entry, response){
	//be very defensive
	if (response.about && response.about.length && response.about.length > entry.desc){
		console.log("===============" + response.name + "NEED TO UPDATE===============")
		console.log(response.about);
		console.log(entry.desc);
	}
}