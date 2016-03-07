var express = require('express');
var app = express();

var CronJob = require('cron').CronJob;
var facebookPipeline = require('./controllers/facebookPipeline.js');

var job = new CronJob({
  cronTime: '* * * * * *',
  onTick: Task(),
  start: false,
  timeZone: 'America/Los_Angeles'
});
job.start();

function Task(){
	facebookPipeline.facebookStart();
}

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


