
var simpleactors = require('../');

exports['Create Router with Actor'] = function(test) {
    function done(msg, sender) {
        test.equal(msg, 'foo');
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

exports['Create Router with Two Actors'] = function(test) {
    function done1(msg) {
        if (msg === 'foo')
            return;
        test.equal(msg, 'spam');
        test.done();
    }
    
    function done2(msg) {
        test.equal(msg, 'bar');
    }
    
    var system = simpleactors.create('MySystem');
    var myactor1 = new MyActor(done1);
    var myactor2 = new MyActor(done2);
    var routerref = system.actorOf(myactor1, 'myactor', { router: true });
    var actorref2 = system.actorOf(myactor2, 'myactor2');
    routerref.add(actorref2);
    
    test.expect(6);
    
    test.ok(myactor1.self === routerref);
    test.ok(myactor2.self === routerref);
    test.ok(myactor1.context.self === routerref);
    test.ok(myactor2.context.self === routerref);
    
    routerref.tell('foo');
    routerref.tell('bar');
    routerref.tell('spam');
}

function MyActor(done) {
    this.receive = function (msg) {
        done(msg);
    }
}
