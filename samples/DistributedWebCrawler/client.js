
var simpleactors = require('../../');

// Objects

var downloader = require('./downloader.js');
var harvester = require('./harvester.js');

// Node

var port = parseInt(process.argv[2]);
var node = simpleactors.createNode(port);

// System

var webcrawler = node.create('webcrawler');

// Actors

var downloaderref = webcrawler.actorOf(downloader);
var harvesterref = webcrawler.actorOf(harvester);

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

