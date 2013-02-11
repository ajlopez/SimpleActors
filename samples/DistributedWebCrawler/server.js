
var simpleactors = require('../../');

// Objects

var downloader = require('./downloader.js');
var resolver = require('./resolver.js');
var harvester = require('./harvester.js');

// Node

var node = simpleactors.createNode(3000);

// System

var webcrawler = node.create('webcrawler');

// Actors

var downloaderref = webcrawler.actorOf(downloader);
var resolverref = webcrawler.actorOf(resolver);
var harvesterref = webcrawler.actorOf(harvester);

// Actors Collaboration

downloader.harvester = harvesterref;
harvester.resolver = resolverref;
resolver.downloader = downloaderref;

// Node start

node.start();

// Process arguments

process.argv.forEach(function(arg) {
    if (arg.indexOf("http:")==0)
    {
        resolver.registerHost(arg);
        downloaderref.tell(arg);
    }
});

