  // Connecting with server on port 3000.
var server_name = 'http://127.0.0.1:3000/';
var server = io.connect(server_name);
console.log('Client: Connecting to server '+ server_name);

// Listening to event 'tweet_message' from the server.
server.on('tweet_message', function(data) {
   //Updates the total number of tweets received.
   $('#total').html('<h1>'+ data.total +'</h1>');

   // Updates the Left column with statistics and tweets with love.
   if(data['text'].toLowerCase().indexOf('love') >= 0) {

       // Shows last 10 love tweets
       if ($('#lbody div').size() > 10) {
           $('#lbody div:last').remove();
       }
      // Updates image and love tweets
       $('#lbody').prepend('<div><h5>'+'<img src="'+ data.url +'">'+'<b>'+ data.name + '</b>' + data['text'] + '</h5></div>');
       // Updates the number of love tweets
       $('#lcount').html('<h4>'+data.l_count+'</h4>');
       // Updates the percentage of love tweets
       $('#lpercent').html('<h4>'+data.l_percent+'</h4>');
   }

    // Updates the right column with statistics and tweets with hate
    if(data['text'].toLowerCase().indexOf('hate') >= 0) {

       // Shows last 10 hate tweets
       if ($('#hbody div').size() > 10) {
           $('#hbody div:last').remove();
       }
       // Updates image and hates tweets
       $('#hbody').prepend('<div><h5>'+'<img src="'+ data.url +'">'+'<b>'+ data.name + '</b>' + data['text'] + '</h5></div>');
       // Updates the number of hate tweets 
        $('#hcount').html('<h4>'+data.h_count+'</h4>');
        // Updates percentage of hate tweets
        $('#hpercent').html('<h4>' + data.h_percent+'</h4>');
   }
});
