
var simpleactors = require('../../');

function Router() {
    var refs = [];
    var position = 0;
    
    this.tell = function (msg) {
        while (refs.length) {
            try {
                position = position % refs.length;
                refs[position++].tell(msg);
                return;
            }
            catch (err) { }
        }
    }
    
    this.add = function (ref) {
        refs.push(ref);
    }
}

function Server() {
    this.receive = function (path) {
        router.add(webcrawler.actorFor(path));
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

var downloaderref = webcrawler.actorOf(downloader, 'downloader');
var resolverref = webcrawler.actorOf(resolver, 'resolver');
var harvesterref = webcrawler.actorOf(harvester, 'harvester');
var serverref = webcrawler.actorOf(server, 'server');

var router = new Router();
router.add(downloaderref);

// Actors Collaboration

downloader.harvester = harvesterref;
harvester.resolver = resolverref;
resolver.downloader = router;

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

