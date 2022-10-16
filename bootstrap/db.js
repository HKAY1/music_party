const mongoose = require('mongoose');

function loadModels(){
    require('models/user');
    require('models/music');
    require('models/favMusic');
}

module.exports = (config, eventEmitter) =>{
    // console.log("config ==> \n", config);
    loadModels();

    function connect(){
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } 
    /* const options = {
            keepAlive: 120,
            autoIndex: false, // Don't build indexes
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0
       } */
       var url =config[config.node_env].mongoose.uri.replace("<password>",encodeURIComponent(config[config.node_env].mongoose.dbPassword)) ;
       mongoose.connect(url, options);
    }

    connect();

    // re-connect on disconnection
    mongoose.connection.on('disconnected', connect);

    // log error on connection error
    mongoose.connection.on('error', console.error.bind(console, 'error on connecting...', config.mongoose.uri));

    //on successfull connection, emit an event (so, can finally start the app)
    mongoose.connection.once('open', ()=>{
            console.log('db connected successfully to -> ', config.mongoose.uri);
            eventEmitter.emit('db-connection-done');
    });

    return mongoose;
}


