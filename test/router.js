
var simpleactors = require('../');

exports['Create Router'] = function(test) {
    function done(msg, sender) {
        test.ok(msg, 'foo');
        test.done();
    }
    
    var system = simpleactors.create('MySystem');
    var myactor = new MyActor(done);
    var actorref = system.actorOf(myactor, 'myactor', { router: true });
    
    test.expect(7);
    
    test.ok(actorref);
    test.ok(myactor.context);
    test.ok(myactor.self);
    test.ok(myactor.self === actorref);
    test.ok(myactor.context.self === actorref);
    test.ok(!actorref.actor);
    
    actorref.tell('foo');
}

function MyActor(done) {
    this.receive = function (msg) {
        done(msg);
    }
}
