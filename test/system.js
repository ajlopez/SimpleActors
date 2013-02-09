
var simpleactors = require('../');

exports['system.actorOf using Function'] = function(test) {
    var system = simpleactors.create('MySystem');
    var actorref = system.actorOf(MyActor);
    
    test.ok(actorref);
    test.equal(typeof system, 'object');
    test.done();
}

exports['system.actorOf has path'] = function(test) {
    var system = simpleactors.create('my-sys');
    var actorref = system.actorOf(MyActor);
    
    test.ok(actorref);
    test.ok(actorref.path);
    test.equal(actorref.path, "sactors://my-sys/1");
    
    test.done();
}

exports['two system actors with paths'] = function(test) {
    var system = simpleactors.create('my-sys');
    var actorref1 = system.actorOf(MyActor);
    var actorref2 = system.actorOf(MyActor);

    test.ok(actorref1);
    test.ok(actorref1.path);
    test.equal(actorref1.path, "sactors://my-sys/1");

    test.ok(actorref2);
    test.ok(actorref2.path);
    test.equal(actorref2.path, "sactors://my-sys/2");

    test.done();
}

exports['system.actorOf with name'] = function(test) {
    var system = simpleactors.create('my-sys');
    var actorref = system.actorOf(MyActor, 'actor1');

    test.ok(actorref);
    test.ok(actorref.path);
    test.equal(actorref.path, "sactors://my-sys/actor1");

    test.done();
}

exports['system.actorOf using object'] = function(test) {
    var system = simpleactors.create('MySystem');
    var myactor = new MyActor();
    var actorref = system.actorOf(myactor);
    
    test.ok(actorref);
    test.equal(typeof system, 'object');
    
    test.ok(myactor.self);
    test.ok(myactor.self === actorref);
    
    test.ok(myactor.context);
    test.ok(myactor.context.self);
    test.ok(myactor.context.self === actorref);
    
    test.done();
}

function MyActor() {
}