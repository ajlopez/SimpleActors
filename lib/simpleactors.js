
var simplemessages = require('simplemessages');

var EventEmitter = process.EventEmitter;

var items = new EventEmitter();

items.post = function(item)
{
    items.emit('item', item);
}

items.on('item', function(item)
{
    if (typeof item == 'function')
        item();
});

function ActorWrapper(obj)
{
    var agent = this;
    
    for (n in obj)
    {
        if (typeof obj[n] != 'function')
            continue;
            
        this[n] = makePost(obj, obj[n]);
    }
    
    this._isActor = true;
}

function makeFunction(target, fn, args, cb)
{
    return function() { 
        try {
            var result = fn.apply(target, args);
        }
        catch (err)
        {
            if (cb && cb.length == 2)
                cb(err);
            return;
        }
        
        if (cb)
            if (cb.length == 2)
                cb(null, result);
            else
                cb(result);
        else
            return result;
    }
}

function makePost(target, fn)
{
    return function() { 
        var args = asArray(arguments);
        var cb;
        
        // last argument is a callback        
        if (args && args.length > 0 && typeof args[args.length-1] == 'function')
        {
            cb = args[args.length-1];
            args = args.slice(0, args.length-1);
        }        
        // pre-last argument is a callback to be passed to final method invocation
        else if (args && args.length > 1 && typeof args[args.length-2] == 'function' && args[args.length-1] === true)
            args = args.slice(0, args.length-1);

        items.post(makeFunction(target, fn, args, cb)); 
    }
}

// Hack: function receives an array-like object but apply expects an array

function asArray(obj)
{
    if (Array.isArray(obj))
        return obj;
        
    var result = [];
    
    for (var n in obj)
        result[parseInt(n)] = obj[n];
        
    return result;
}

exports.post = function(item)
{
    items.post(item);
}

exports.asActor = function(obj)
{
    return new ActorWrapper(obj);
}

exports.buildActor = function(obj, mthname)
{
    if (!mthname)
        mthname = 'process';
        
    obj._isBuildActor = true;
    obj.post = makePost(obj, obj[mthname]);
}

exports.isActor = function(actor)
{
	if (actor == null)
		return false;
		
    return (actor._isActor || actor._isBuildActor) ? true : false;
}

function ActorSystem(name, node) {
    var counter = 0;
    this.name = name;
    this.path = "sactors://" + name;
    this.children = { };
    this.node = node;
    
    this.nextNumber = function () {
        counter++;
        return counter;
    }
}

ActorSystem.prototype.actorOf = function(clss, name) {
    var actor = newActor(clss, this, null, name);
    this.children[name] = actor;
    return actor;
}

ActorSystem.prototype.actorFor = function (name) {
    if (name.indexOf(':') > 0) {
        var path = parsePath(name);
        if (path.server) {
            var servername = path.server + ':' + path.port;
            if (servername !== this.node)
                return new RemoteActorRef(this.node, servername, name);
        }
        
        name = path.path;
    }

    if (name && name[0] === '/')
        name = name.substring(1);

    return this.children[name];
}

function newActor(clss, system, parent, name) {
    var actor;
    
    if (typeof clss === 'function')
        actor = new clss();
    else
        actor = clss;
        
    if (!name)
        name = system.nextNumber();
        
    var ref = new ActorRef(actor, parent ? parent.path : system.path, name);
    var context = new ActorContext(actor, ref, system, parent);

    return ref;
}

function ActorContext(actor, reference, system, parent) {
    actor.context = this;
    actor.self = reference;
    this.system = system;
    this.self = reference;
    this.parent = parent;
    this.children = { };
}

ActorContext.prototype.actorOf = function(clss, name) {
    var child = newActor(clss, this.system, this.self, name);
    this.children[name] = child;
    return child;
}

ActorContext.prototype.actorFor = function(name) {
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

function RemoteActorRef(node, remotenodename, path) {
    this.path = path;
    this.node = node;
    this.remote = remotenodename;
}

RemoteActorRef.prototype.tell = function (msg) {
    this.node.tellNode(this.remote, this.path, msg);
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

exports.parsePath = parsePath;

function Node(port, host) { 
    this.name = (host ? host : 'localhost') + ':' + port;
    
    var server;
    var systems = { };
    var nodes = { };
    var clients = [];

    this.create = function (name) {
        var fullname = name + '@' + this.name;
        var system = new ActorSystem(fullname, this);
        systems[name] = system;
        return system;
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
    
    this.connect = function (port, host, fn) {
        var self = this;
        
        var client = simplemessages.createClient(port, host, function() {
            clients.push(client);
            var name = (host ? host : 'localhost') + ':' + port;
            self.registerNode(name, new RemoteNode(port, host, client));
            
            if (fn)
                fn(client);
        });
    }

    this.process = function (msg, sender) {
        if (msg.path) {
            var path = msg.path;
            var message = msg.message;
            var ph = parsePath(path);
            systems[ph.system].actorFor(ph.path).tell(message);
        }
    }

    this.registerNode = function (name, node) {
        nodes[name] = node;
    }

    this.tellNode = function (name, path, message) {
        nodes[name].process({ path: path, message: message });
    }

    this.stop = function () {
        if (server) {
            server.close();
            server = null;
        }
        
        clients.forEach(function (client) { client.end(); });
    }
}

function RemoteNode(port, host, client) { 
    this.name = (host ? host : 'localhost') + ':' + port;
    
    var systems = { };

    this.create = function (name) {
        var fullname = name + '@' + this.name;
        var system = new ActorSystem(fullname, this);
        systems[name] = system;
        return system;
    }

    this.start = function (fn) {
        var self = this;
        var client = simplemessages.createClient(port, host, function() {
            if (fn)
                fn(client);
        });
    }
    
    this.process = function (msg) {
        client.write(msg);
    }

    this.stop = function () {
        if (client)
            client.end();
    }
}

exports.createNode = function (port,host) {
    return new Node(port, host);
}

