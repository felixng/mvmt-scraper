var FB = require('fb');

module.exports = {
	facebookStart: function (){
		FB.api('oauth/access_token', {
				client_id: '1584642161826737',
				client_secret: 'ba483f4532ef9d6ad76c4e67db9b50ce',
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

var getAccessToken = function(client_id, client_secret){
	FB.api('oauth/access_token', {
				client_id: '1584642161826737',
				client_secret: 'ba483f4532ef9d6ad76c4e67db9b50ce',
				grant_type: 'client_credentials'
			}, function (response) {
				if(!response || response.error) {
					console.log(!response ? 'error occurred' : response.error);
					return;
				}
				accessToken = response.access_token;
				FB.setAccessToken(accessToken);
			})
}

var pingAPI = function(){
	var pg = require('pg');
	var conString = "postgres://postgres:01478520@localhost/mvmt";
	var client = new pg.Client(conString);
	
	client.connect(function(err) {
	  if(err) {
		return console.error('could not connect to postgres', err);
	  }
	  client.query("SELECT facebook FROM public.resources where trim(facebook) != '';", function(err, result) {
		if(err) {
		  return console.error('error running query', err);
		}
		
		result.rows.forEach(function(entry) {
			//ping facebook
			var query = '/' + entry.facebook;
			
			FB.api(query, { fields: ['id', 'name', 'about'] }, function (response) {
			  if(!response || response.error) {
			   console.log(!response ? 'error occurred' : response.error);
			   return;
			  }
			  console.log(new Date());
			  console.log(response);
			});
		});
		
		client.end();
	  });
	});
}