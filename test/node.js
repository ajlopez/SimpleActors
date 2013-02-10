
var simpleactors = require('../'),
    simplemessages = require('simplemessages');

exports['Create Node in Localhost'] = function (test) {
    var node = simpleactors.createNode(3000);
    
    test.ok(node);
    test.ok(node.name);
    test.equal(node.name, "localhost:3000");

    test.done();
}

exports['Create Node in Host'] = function (test) {
    var node = simpleactors.createNode(3000, 'host');
    
    test.ok(node);
    test.ok(node.name);
    test.equal(node.name, "host:3000");

    test.done();
}

exports['Create Actor in Node'] = function (test) {
    var node = simpleactors.createNode(3000);
    test.ok(node);
    
    var system = node.create('mysys');
    test.ok(system);
    
    var actorref = system.actorOf(MyActor, 'actor');
    test.ok(actorref);    
    test.ok(actorref.path);
    test.equal(actorref.path, 'sactors://mysys@localhost:3000/actor');
    
    test.done();
}

exports['Send Message to Remote Actor'] = function (test) {
    var node = simpleactors.createNode(3000);
    var system = node.create('mysys');
    var actor = new MyActor();
    
    test.expect(2);

    actor.receive = function (msg) {
        test.ok(msg);
        test.equal(msg, 'foo');
        client.end();
        node.stop();
        test.done();
    }

    var actorref = system.actorOf(actor, 'actor');

    node.start();
    
    var client = simplemessages.createClient(3000, null, function () {
        client.write({ path: actorref.path, message: 'foo' });
    });
}

function MyActor() {
}

