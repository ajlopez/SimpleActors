
var simplemessages = require('simplemessages');

function ActorSystem(name, node) {
    var counter = 0;
    this.name = name;
    this.path = "sactors://" + name;
    this.children = { };
    this.node = node;
    
    this.nextName = function () {
        counter++;
        return '_' + counter;
    }
}

ActorSystem.prototype.actorOf = function(clss, name, options) {
    var actor = newActor(clss, this, null, name, options);
    this.children[name] = actor;
    return actor;
}

ActorSystem.prototype.actorFor = function (name) {
    if (name.indexOf(':') > 0) {
        var path = parsePath(name);

        if (path.server) {
            var servername = path.server + ':' + path.port;
            if (servername !== this.node.name)
                return this.node.getNode(servername).getSystem(path.system).actorFor(path.path);
        }
        
        name = path.path;
    }

    if (name && name[0] === '/')
        name = name.substring(1);
        
    var position = name.indexOf('/');
    
    if (position > 0) {
        var rest = name.substring(position + 1);
        name = name.substring(0, position);
        return this.children[name].context.actorFor(rest);
    }
    else
        return this.children[name];
}

function RemoteActorSystem(name, node) {
    this.name = name;
    this.path = "sactors://" + name;
    this.node = node;
}

RemoteActorSystem.prototype.actorFor = function (name) {
    var path = this.path;
    
    if (name[0] === '/')
        path += name;
    else
        path += '/' + name;
        
    return new RemoteActorRef(this.node, path);
}

function newActor(clss, system, parent, name, options) {
    var actor;
    
    if (typeof clss === 'function')
        actor = new clss();
    else
        actor = clss;
        
    if (!name)
        name = system.nextName();
        
    var ref = new ActorRef(actor, parent ? parent.path : system.path, name);
    
    if (options && options.router)
        ref = new ActorRouterRef(ref);
    
    var context = new ActorContext(actor, ref, system, parent);

    return ref;
}

function ActorContext(actor, reference, system, parent) {
    actor.context = this;
    actor.self = reference;
    reference.context = this;
    this.system = system;
    this.self = reference;
    this.parent = parent;
    this.children = { };
}

ActorContext.prototype.actorOf = function(clss, name, options) {
    var child = newActor(clss, this.system, this.self, name, options);
    this.children[name] = child;
    return child;
}

ActorContext.prototype.actorFor = function(name) {
    if (name[0] === '/')
        return this.system.actorFor(name);

    if (name === '..')
        return this.parent;
        
    if (name.substring(0, 3) === '../')
        return this.parent.context.actorFor(name.substring(3));
        
    if (name.indexOf(':') > 0)
        return this.system.actorFor(name);
        
    var position = name.indexOf('/');
    
    if (position > 0) {
        var rest = name.substring(position + 1);
        name = name.substring(0, position);
        return this.children[name].context.actorFor(rest);
    }
    else
        return this.children[name];
}

function ActorRef(actor, parentpath, name) {
    this.actor = actor;
    
    this.path = parentpath + "/" + name;
}

ActorRef.prototype.tell = function (msg) {
    var self = this;
    process.nextTick(function () { self.actor.receive(msg); });
}

function ActorRouterRef(reference) {
    this.references = [ reference ];
    this.path = reference.path;
    this.position = 0;
}

ActorRouterRef.prototype.tell = function (msg) {
    var visited = 0;
    var length = this.references.length;
    
    for (var visited = 0; visited < length; visited++) {
        if (this.references[this.position])
            try {
                this.references[this.position].tell(msg);
                this.position = (this.position + 1) % this.references.length;
                return;
            }
            catch (err) {
            }
            
        this.position = (this.position + 1) % this.references.length;
    }
}

ActorRouterRef.prototype.add = function (reference) {
    this.references.push(reference);
    
    if (reference.actor) {
        reference.actor.self = this;
        reference.actor.context.self = this;
    }
}

function RemoteActorRef(node, path, remotenodename) {
    this.path = path;
    this.node = node;
    this.remote = remotenodename;
}

RemoteActorRef.prototype.tell = function (msg) {
    if (this.remote)
        this.node.tellNode(this.remote, this.path, msg);
    else
        this.node.process({ path: this.path, message: msg });
}

exports.create = function (name) {
    return new ActorSystem(name);
}

function parsePath(path) {
    var result = { };
    var position = path.indexOf(':');
    
    result.protocol = path.substring(0, position);
    
    var rest = path.substring(position + 3);
    
    var positionat = rest.indexOf('@');
    position = rest.indexOf('/');
    
    if (positionat >= 0 && positionat < position) {
        result.system = rest.substring(0, positionat);
        result.server = rest.substring(positionat + 1, position);
        
        var poscolon = result.server.indexOf(':');
        
        if (poscolon > 0) {
            result.port = parseInt(result.server.substring(poscolon + 1));
            result.server = result.server.substring(0, poscolon);
        }
    }
    else
        result.system = rest.substring(0, position);
        
    result.path = rest.substring(position);
    
    return result;
}

function makeName(port, host) {
    if (!port)
        return host;

    if (!host)
        host = 'localhost';

    return host + ':' + port;
}

function parseName(name) {
    var position = name.indexOf(':');
    var host;
    var port;
    
    if (position > 0) {
        host = name.substring(0, position);
        port = parseInt(name.substring(position+1));
    }
    else
        host = name;
        
    return { host: host, port: port };
}

exports.parsePath = parsePath;

function Node(port, host) {
    if (typeof port === 'string') {
        this.name = port;
        var porthost = parseName(port);
        port = porthost.port;
        host = porthost.host;
    }
    else
        this.name = makeName(port, host);
    
    var server;
    var systems = { };
    var nodes = [];
    var clients = [];

    this.create = function (name) {
        var fullname = name + '@' + this.name;
        var system = new ActorSystem(fullname, this);
        systems[name] = system;
        return system;
    }

    this.getSystem = function (name) {
        return systems[name];
    }

    this.start = function () {
        var self = this;
        server = simplemessages.createServer(function (stream) {
            stream.on('data', function (msg) {
                self.process(msg, stream);
            });
        });

        server.listen(port, host);
    }
    
    this.createRemoteNode = function (port, host) {
        if (typeof port === 'string')
            return new RemoteNode(port, this);
        else
            return new RemoteNode(port, host, this);
    }
    
    this.process = function (msg, sender) {
        // Tell message to actor
        if (msg.path) {
            var path = msg.path;
            var message = msg.message;
            var ph = parsePath(path);
            systems[ph.system].actorFor(ph.path).tell(message);
            return;
        }
        // New node
        if (msg.node) {
            new RemoteNode(msg.node, this, sender);
            return;
        }
    }

    this.registerNode = function (name, node) {
        nodes[name] = node;
    }
    
    this.getNode = function (name) {
        return nodes[name];
    }

    this.unregisterNode = function (name) {
        delete nodes[name];
    }

    this.tellNode = function (name, path, message) {
        nodes[name].process({ path: path, message: message });
    }

    this.stop = function () {
        if (server) {
            server.close();
            server = null;
        }
        
        nodes.forEach(function (node) { node.stop(); });
    }
}

function RemoteNode(port, host, local, client) { 
    if (typeof port === 'string') {
        client = local;
        local = host;
        this.name = port;
        var porthost = parseName(port);
        port = porthost.port;
        host = porthost.host;
    }
    else
        this.name = makeName(port, host);
        
    var systems = { };
    
    if (local)
        local.registerNode(this.name, this);
    
    this.create = function (name) {
        var fullname = name + '@' + this.name;
        var system = new RemoteActorSystem(fullname, this);
        systems[name] = system;
        return system;
    }
    
    this.getSystem = function (name) {
        if (systems[name])
            return systems[name];

        return this.create(name);
    }

    this.start = function (fn) {
        var self = this;
        client = simplemessages.createClient(port, host, function() {
            client.on('end', function () { console.log('end'); client = null; });
            client.on('error', function () { console.log('error'); client = null; });
            client.on('close', function () { console.log('close'); client = null; });
            
            if (local) {
                client.on('end', function () { local.unregisterNode(this.name); });
                client.on('error', function () { local.unregisterNode(this.name); });
                client.on('close', function () { local.unregisterNode(this.name); });
                client.on('data', function (msg) { local.process(msg); });
                client.write({ node: local.name });
            }

            if (fn)
                fn(client);
        });
    }
    
    this.process = function (msg) {
        if (!client)
            throw "invalid socket";
        client.write(msg);
    }

    this.stop = function () {
        if (client) {
            client.end();
            client = null;
        }
    }
}

exports.createNode = function (port,host) {
    return new Node(port, host);
}

