
var simpleactors = require('../');

exports['Simple Call to Actor'] = function(test) {
    test.expect(2);
    
    var obj = new MyObject(test);
    var actor = simpleactors.asActor(obj);
    
    actor.method("foo");
}

function MyObject(test) {
    this.method = function(msg)
    {
        test.ok(msg);
        test.equal(msg, "foo");
        test.done();
    }
}

