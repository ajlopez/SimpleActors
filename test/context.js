
var simpleactors = require('../');

exports['context in actor'] = function(test) {
    var system = simpleactors.create('MySystem');
    var myactor = new MyActor();
    var ref = system.actorOf(myactor);
    
    test.ok(myactor.context);
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
    test.done();
}

function MyActor() {
}