
var simpleactors = require('../');

exports['tell simple message'] = function(test) {
    function done(msg) {
        test.ok(msg, 'foo');
        test.done();
    }
    
    var system = simpleactors.create('MySystem');
    var myactor = new MyActor(done);
    var actorref = system.actorOf(myactor);
    
    test.expect(1);
    
    actorref.tell('foo');    
}

function MyActor(done) {
    this.receives = function (msg) {
        done(msg);
    }
}
