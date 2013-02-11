
var simpleactors = require('../');

exports['context in actor'] = function(test) {
    var system = simpleactors.create('MySystem');
    var myactor = new MyActor();
    var ref = system.actorOf(myactor);
    
    test.ok(myactor.context);
    test.ok(myactor.context.self);
    test.ok(myactor.context.self === ref);
    
    test.done();
}

exports['context.actorOf'] = function(test) {
    var system = simpleactors.create('MySystem');

    var myactor = new MyActor();
    var ref = system.actorOf(myactor);    
    var myactor2 = new MyActor();

    var actorref = myactor.context.actorOf(myactor2);
    test.ok(actorref);
    test.ok(myactor2);
    test.ok(myactor2.context);
    test.ok(myactor2.context.self);
    test.ok(myactor2.context.self === actorref);
    test.ok(myactor2.context.parent);
    test.ok(myactor2.context.parent === ref);
    test.done();
}

exports['actor created with context has path'] = function(test) {
    var system = simpleactors.create('MySystem');

    var myactor = new MyActor();
    var ref = system.actorOf(myactor, 'myactor');
    var myactor2 = new MyActor();

    var actorref = myactor.context.actorOf(myactor2, 'mychildren');
    test.ok(actorref);
    test.ok(actorref.path);
    test.equal(actorref.path, 'sactors://MySystem/myactor/mychildren');
    test.done();
}

exports['actor has children'] = function(test) {
    var system = simpleactors.create('MySystem');

    var myactor = new MyActor();
    var ref = system.actorOf(myactor, 'myactor');
    var myactor2 = new MyActor();

    var childref = myactor.context.actorOf(myactor2, 'mychildren');
    test.ok(myactor.context.children);
    test.ok(myactor.context.children.mychildren);
    test.ok(myactor.context.children.mychildren === childref);
    test.done();
}

exports['actorFor parent'] = function(test) {
    var system = simpleactors.create('MySystem');

    var myactor = new MyActor();
    var ref = system.actorOf(myactor, 'myactor');
    var myactor2 = new MyActor();

    var childref = myactor.context.actorOf(myactor2, 'mychildren');
    
    var result = myactor2.context.actorFor('..');
    test.ok(result === ref);
    test.done();
}

exports['context.forActor'] = function(test) {
    var system = simpleactors.create('MySystem');

    var myactor = new MyActor();
    var actorref = system.actorOf(myactor, 'myactor');
    var myactor2 = new MyActor();
    var childref = myactor.context.actorOf(myactor2, 'mychildren');
    
    var result = myactor.context.actorFor('mychildren');
    test.ok(result);
    test.ok(result === childref);

    test.done();
}

exports['context.forActor returns null for unknown actor'] = function(test) {
    var system = simpleactors.create('MySystem');

    var myactor = new MyActor();
    var actorref = system.actorOf(myactor, 'myactor');
    
    var result = myactor.context.actorFor('mychildren');
    test.equal(result, null);

    test.done();
}

function MyActor() {
}