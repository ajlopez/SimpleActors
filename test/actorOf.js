
var simpleactors = require('../');

exports['actorOf using Function'] = function(test) {
    var system = simpleactors.create('MySystem');
    var actorref = system.actorOf(MyActor);
    
    test.ok(actorref);
    test.equal(typeof system, 'object');
    test.done();
}

exports['actorOf using object'] = function(test) {
    var system = simpleactors.create('MySystem');
    var myactor = new MyActor();
    var actorref = system.actorOf(myactor);
    
    test.ok(actorref);
    test.equal(typeof system, 'object');
    
    test.ok(myactor.self);
    test.ok(myactor.self === actorref);
    
    test.done();
}

function MyActor() {
}