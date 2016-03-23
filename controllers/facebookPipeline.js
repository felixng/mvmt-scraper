var FB = require('fb');
var pg = require('pg');
var conString = "postgres://postgres:01478520@localhost/mvmt";


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
	
	var client = new pg.Client(conString);
	
	client.connect(function(err) {
	  if(err) {
		return console.error('could not connect to postgres', err);
	  }
	  client.query("SELECT id, public.resources.facebook, public.resources.desc FROM public.resources where trim(facebook) != '' and id = 42;", function(err, result) {
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

function updateResource (id, cols) {
  // Setup static beginning of query
  var query = ['UPDATE public.resources'];
  query.push('SET');
	console.log(cols);
  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = [];
  Object.keys(cols).forEach(function (obj) {
	console.log(obj);
    //set.push(key + ' = ($' + (i + 1) + ')'); 
  });
  query.push(set.join(', '));

  // Add the WHERE statement to look up by id
  query.push('WHERE public.resources.id = ' + id );

  // Return a complete query string
  return query.join(' ');
}

var checkAndUpdate = function(entry, response){
	//be very defensive
	if (response.about && response.about.length && response.about.length > entry.desc){
		var query = updateResource(entry.id, {['desc']});
		console.log(query);
		
		var client = new pg.Client(conString);
		client.connect(function(err) {
			client.query(query, entry, function(err, result) {
				if(err) {
				  return console.error('error running query', err);
				};
				console.log("DONE");
			});
		});	
		
		console.log("===============" + response.name + "NEED TO UPDATE " + response.about.length + "===============")
		console.log(response.about);
		console.log(entry.desc);
	}
}