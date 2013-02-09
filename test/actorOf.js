
var simpleactors = require('../');

exports['actorOf'] = function(test) {
    var system = simpleactors.create('MySystem');
    var actorref = system.actorOf(MyActor);
    
    test.ok(actorref);
    test.equal(typeof system, 'object');
    test.done();
}

function MyActor() {
}