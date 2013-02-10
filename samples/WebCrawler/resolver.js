var http = require('http'),
    url = require('url');

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
    
    this.receive = function(link) {
        var urldata = url.parse(link);

        if (!isHostName(urldata.hostname))
            return;

        if (this.visited[link])
            return;

        this.visited[link] = true;
        this.downloader.tell(link);
    }
    
    this.registerHost = function(link)
    {
        var urldata = url.parse(link);
        registerHostName(urldata.hostname);
    }
}

module = module.exports = new Resolver();

