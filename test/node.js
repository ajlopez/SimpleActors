
var simpleactors = require('../');

exports['Create Actor in Node'] = function(test) {
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

