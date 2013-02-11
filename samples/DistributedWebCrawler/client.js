
var simpleactors = require('../../');

// Objects

var downloader = require('./downloader.js');
var harvester = require('./harvester.js');

// Local Node

var port = parseInt(process.argv[2]);
var node = simpleactors.createNode(port);

// Local System

var webcrawler = node.create('webcrawler');

// Remote Node and System

var remotenode = node.createRemoteNode(3000);
var remotesystem = remotenode.create('webcrawler');

// Local Actors

var downloaderref = webcrawler.actorOf(downloader, 'downloader');
var harvesterref = webcrawler.actorOf(harvester, 'harvester');

// Remote Actors

var resolverref = remotesystem.actorFor('resolver');
var serverref = remotesystem.actorFor('server');

// Actors Collaboration

downloader.harvester = harvesterref;
harvester.resolver = resolverref;

// Tell to Server the new Downloader path

remotenode.start(function () {
    serverref.tell(downloaderref.path);
});

