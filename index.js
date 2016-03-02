var FB = require('fb');
var accessToken = '';
FB.api('oauth/access_token', {
    client_id: '1584641475160139',
    client_secret: 'd1690d44adb151149209e2912ceef21e',
    grant_type: 'client_credentials'
}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }

    accessToken = res.access_token;
    
    FB.setAccessToken(accessToken);
    FB.api('/mvmtApp', { fields: ['id', 'name', 'about'] }, function (res) {
      if(!res || res.error) {
       console.log(!res ? 'error occurred' : res.error);
       return;
      }
      console.log(res);
    });
});





var CronJob = require('cron').CronJob;
new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

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


