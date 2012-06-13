
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

module = module.exports = new Harvester();

