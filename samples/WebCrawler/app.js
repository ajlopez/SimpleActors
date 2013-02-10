
var simpleactors = require('../../');

// Objects

var downloader = require('./downloader.js');
var resolver = require('./resolver.js');
var harvester = require('./harvester.js');

// Actors

var webcrawler = simpleactors.create('webcrawler');

var downloaderref = webcrawler.actorOf(downloader);
var resolverref = webcrawler.actorOf(resolver);
var harvesterref = webcrawler.actorOf(harvester);

// Actors Collaboration

downloader.harvester = harvesterref;
harvester.resolver = resolverref;
resolver.downloader = downloaderref;

// Process arguments

process.argv.forEach(function(arg) {
    if (arg.indexOf("http:")==0)
    {
        resolver.registerHost(arg);
        downloaderref.tell(arg);
    }
});

