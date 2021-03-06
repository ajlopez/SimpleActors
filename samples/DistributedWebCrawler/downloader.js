var simpleactors = require('../../'),
	http = require('http'),
    url = require('url');

function Downloader() {    
    this.receive = function(link) {
        console.log('link', link);
        var self = this;
        var urldata = url.parse(link);
        
        options = {
            host: urldata.hostname,
            port: urldata.port,
            path: urldata.path,
            method: 'GET'
        };
        
        http.get(options, function(res) { 
                console.log('url', link);
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    self.harvester.tell(data);
                });
           }).on('error', function(e) {
                console.log('url', link);
                console.log('error', e.message);
            });
    }
}

module = module.exports = new Downloader();