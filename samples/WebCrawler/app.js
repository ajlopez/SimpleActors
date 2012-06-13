
var simpleactors = require('../../');

// Objects

var downloader = require('./downloader.js');
var resolver = require('./resolver.js');
var harvester = require('./harvester.js');

// Actors

var downloaderActor = simpleactors.asActor(downloader);
var resolverActor = simpleactors.asActor(resolver);
var harvesterActor = simpleactors.asActor(harvester);

// Actors Collaboration

downloader.harvester = harvesterActor;
harvester.resolver = resolverActor;
resolver.downloader = downloaderActor;

// Process arguments

process.argv.forEach(function(arg) {
    if (arg.indexOf("http:")==0)
    {
        resolver.registerHost(arg);
        downloaderActor.process(arg);
    }
});

