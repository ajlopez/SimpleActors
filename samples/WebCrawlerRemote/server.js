
var simpleactors = require('../../'),
    simpleremote = require('simpleremote');

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

// Downloader Balancer

function DownloadBalancer()
{
    var downloaders = {};
    var ndownloaders = 0;
    
    this.addDownloader = function(downloader) {
        downloader.ndownloader = ndownloaders++;
        downloaders[downloader.ndownloader] = downloader;
    }
    
    this.removeDownloader = function(downloader) {
        if (downloaders[downloader.ndownloader])
            delete downloaders[downloader.ndownloader];
    }
    
    this.process = function(link) {
        var randomnumber=Math.floor(Math.random()*ndownloaders)
        downloaders[randomnumber].process(link);
    }
}

var balancer = new DownloadBalancer();
balancer.addDownloader(downloaderActor);
resolver.downloader = balancer;

// Server object

var obj = {
    process: function(link) { 
        resolverActor.process(link);
    }
};

var server = simpleremote.createRemoteServer(obj);

server.on('remote',
    function(remote) {
        console.log('new remote client');
        balancer.addDownloader(remote);
    });

server.listen(3000);

// Process arguments

process.argv.forEach(function(arg) {
    if (arg.indexOf("http:")==0)
    {
        resolver.registerHost(arg);
        downloaderActor.process(arg);
    }
});

