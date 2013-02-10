
var simpleactors = require('../');

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

function MyActor() {
}

