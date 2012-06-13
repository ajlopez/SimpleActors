
var simpleactors = require('../../'),
    simpleremote = require('simpleremote');

// Objects

var downloader = require('./downloader.js');
var harvester = require('./harvester.js');

// Actors

var downloaderActor = simpleactors.asActor(downloader);
var harvesterActor = simpleactors.asActor(harvester);

// Actors Collaboration

downloader.harvester = harvesterActor;

// Client object

var obj = {
    process: function(link) { 
        downloaderActor.process(link);
    }
};

var client = simpleremote.createRemoteClient(obj);

client.on('remote',
    function(remote) {
        console.log('remote resolver');
        harvester.resolver = remote;
    });

client.connect(3000);

