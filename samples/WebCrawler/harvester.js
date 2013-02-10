
var match1 = /href=\s*"([^&"]*)"/i;
var match2= /href=\s*'([^&']*)'/i;

function Harvester() {
    this.receive = function(data) {
        var self = this;
        var links = match1.exec(data);

        if (links)
            links.forEach(function(link) { 
                if (link.indexOf('http:') == 0)
                    self.resolver.tell(link);
            });

        links = match2.exec(data);

        if (links)
            links.forEach(function(link) { 
                if (link.indexOf('http:') == 0)
                    self.resolver.tell(link);
            });
    }
}

module = module.exports = new Harvester();

