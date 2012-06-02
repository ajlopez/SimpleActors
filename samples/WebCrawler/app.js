
var simpleactors = require('../../'),
	http = require('http'),
    url = require('url'),
    util = require('util'),
    events = require('events');

var hostnames = {};

function registerHostName(hostname)
{
    if (!hostnames[hostname])
    {
        console.log('Host: ' + hostname);
        hostnames[hostname] = true;
    }
}

function isHostName(hostname)
{
    return hostnames[hostname];
}
    
function Resolver() {
    this.visited = {};
    
    this.process = function(link) {
        var urldata = url.parse(link);

        if (!isHostName(urldata.hostname))
            return;

        if (this.visited[link])
            return;

        this.visited[link] = true;
        this.downloader.process(link);
    }
}

function Downloader() {    
    this.process = function(link) {
        var downloader = this;
        var urldata = url.parse(link);
        
        registerHostName(urldata.hostname);
        
        options = {
            host: urldata.hostname,
            port: urldata.port,
            path: urldata.path,
            method: 'GET'
        };
        
        http.get(options, function(res) { 
                console.log('Url: ' + link);
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    downloader.harvester.process(data);
                });
           }).on('error', function(e) {
                console.log('Url: ' + link);
                console.log('Error: ' + e.message);
            });
    }
}

var match1 = /href=\s*"([^&"]*)"/i;
var match2= /href=\s*'([^&']*)'/i;

function Harvester() {
    this.process = function(data) {
        var harvester = this;
        var links = match1.exec(data);

        if (links)
            links.forEach(function(link) { 
                if (link.indexOf('http:') == 0)
                    harvester.resolver.process(link);
            });

        links = match2.exec(data);

        if (links)
            links.forEach(function(link) { 
                if (link.indexOf('http:') == 0)
                    harvester.resolver.process(link);
            });
    }
}

// Objects

var downloader = new Downloader();
var resolver = new Resolver();
var harvester = new Harvester();

// Agents Collaboration

downloader.harvester = simpleactors.asActor(harvester);
harvester.resolver = simpleactors.asActor(resolver);
resolver.downloader = simpleactors.asActor(downloader);

// Process arguments

process.argv.forEach(function(arg) {
    if (arg.indexOf("http:")==0)
        downloader.process(arg);
});

