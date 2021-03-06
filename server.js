'use strict';

const express     = require('express'),
      bodyParser  = require('body-parser'),
      expect      = require('chai').expect,
      cors        = require('cors');

const apiRoutes         = require('./routes/api.js'),
      fccTestingRoutes  = require('./routes/fcctesting.js'),
      runner            = require('./test-runner'),
      helmet            = require('helmet'),
      app               = express();

//Challenge 1: Only allow your site to be loading in an iFrame on your own pages.
//Challenge 2: Do not allow DNS prefetching.
//Challenge 3: Only allow your site to send the referrer for your own pages.
app.use(helmet({
  frameguard: { action: 'sameorigin' },
  dnsPrefetchControl: { allow: false },
  referrerPolicy: { policy: 'same-origin' }
}));

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:thread_id')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//Sample Front-end

    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing