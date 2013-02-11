
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

// Actors

var downloaderref = webcrawler.actorOf(downloader);
var harvesterref = webcrawler.actorOf(harvester);
var resolverref = remotesystem.actorFor('resolver');

// Actors Collaboration

downloader.harvester = harvesterActor;
harvester.resolver = resolverref;
