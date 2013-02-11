
var simpleactors = require('../../');

function Server() {
    this.receive = function (path) {
        downloaderref.add(webcrawler.actorFor(path));
    }
}

// Objects

var downloader = require('./downloader.js');
var resolver = require('./resolver.js');
var harvester = require('./harvester.js');
var server = new Server();

// Node

var node = simpleactors.createNode(3000);

// System

var webcrawler = node.create('webcrawler');

// Actors

var downloaderref = webcrawler.actorOf(downloader, 'downloader', { router: true });
var resolverref = webcrawler.actorOf(resolver, 'resolver');
var harvesterref = webcrawler.actorOf(harvester, 'harvester');
var serverref = webcrawler.actorOf(server, 'server');

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

