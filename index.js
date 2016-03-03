var express = require('express');
var app = express();
var FB = require('fb');
var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '0 0 * * * *',
  grab: function() {
	 FB.api('oauth/access_token', {
				client_id: '1584641475160139',
				client_secret: 'd1690d44adb151149209e2912ceef21e',
				grant_type: 'client_credentials'
			}, function (response) {
				if(!response || response.error) {
					console.log(!response ? 'error occurred' : response.error);
					return;
				}

				accessToken = response.access_token;
				
				FB.setAccessToken(accessToken);
				FB.api('/mvmtApp', { fields: ['id', 'name', 'about'] }, function (response) {
				  if(!response || response.error) {
				   console.log(!response ? 'error occurred' : response.error);
				   return;
				  }
				  console.log(new Date());
				  console.log(response);
				});
			});
  },
  start: true,
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
  response.end(result);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


