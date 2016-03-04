var express = require('express');
var app = express();
var FB = require('fb');
var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '* * * * * *',
  onTick: function() {
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
					//console.log(result.rows[0].facebook);
					client.end();
				  });
				});
				
				
			});
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


