require('app-module-path').addPath(__dirname);
const express = require('express');
global._config = require('./config/config');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const cors = require('cors');


function startApp(){
    const app = express();

    //create server and pass down to socket
    /*
    const server = require('http').createServer(app);
    const socketIo = require('socket.io');
    const io = socketIo(server, {
        cors: {
            origin: "*"
        }
    });
    require('./sockets/socket')(io);*/
    
    //cors 
    app.use(cors());
     //Serving static files
     app.use(express.static('public'));

     //Body parser, reading data from body into req.body
     app.use(express.json());
     app.use(express.urlencoded({ extended: true }));

     require('bootstrap/express')(app, _config);

  
    
    

    app.listen(app.get('port'), ()=>{
        console.log('running app on port %d in %s environment', app.get('port'), _config.node_env);
    })

}

/* configure database */
require('bootstrap/db')(_config, eventEmitter);

/* run seeds after db connection establishment */
eventEmitter.once('db-connection-done', startApp);

/*
eventEmitter.once('db-connection-done', function(){
     require('bootstrap/seed-data')(eventEmitter);
})

eventEmitter.once('seeding-done', startApp);
*/