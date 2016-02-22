var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Creating server socket and listening for client on port 3000.
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Server Socket started and listening on port : " + port);

var sio = require('socket.io').listen(server);

var Twit = require('twit');

// Twitter Credentials
var T = new Twit({
  consumer_key: 'fxXLglwL8CuDXGhqg7B0Q1Mfx',
  consumer_secret: 'NsbdruP9eESo9Bsry6FNMuMuMbjq2cY0dqVdcSDMaPwfffEDQH',
  access_token: '701488760916148224-jJWBab9txnXVnl6q13NmpryhrlbbeQN',
  access_token_secret: '4UgfZMmN2mtfBxoCK0ak0ruZ7C8rcuklCgc38Er5vuf96'
});

var love_count = 0;
var hate_count = 0;
var love_percent = 0;
var hate_percent = 0;
var total = 0;

//Query to fetch the twitter stream with filter Love and Hate.
var stream = T.stream('statuses/filter', { track: ['love', 'hate'] });

//Listening to 'tweet' event which sends callback whenever someone sends a tweet with the specified filter.
stream.on('tweet', function(tweet){
    //Calculating the statistics.
    if(tweet['text'].toLowerCase().indexOf('love') >= 0) {
        love_count+=1;
    }
    if(tweet['text'].toLowerCase().indexOf('hate') > -1) {
        hate_count+=1;
    }
    total = love_count + hate_count;
    love_percent = Math.round((love_count / total) * 100);
    hate_percent = Math.round((hate_count / total) * 100);


  //Sending count, image, tweet and percentage to socket client
    sio.sockets.emit('tweet_message', {
        l_count: love_count,
        h_count: hate_count,
        l_percent: love_percent,
        h_percent: hate_percent,
        total: total,
        text: tweet.text,
        name: tweet.user.screen_name,
        url: tweet.user.profile_image_url
    });

});

// Check if client is connected
sio.sockets.on('connection', function(socket) {
    console.log('Web client connected');

    socket.on('disconnect', function() {
        console.log('Web Client Disconnected');
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
