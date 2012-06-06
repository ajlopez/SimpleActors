
var simpleactors = require('../');

exports['Simple Post to Actor'] = function(test) {
    test.expect(2);
    
    var obj = new MyObject(test);
    var actor = simpleactors.asMessageActor(obj);
    
    actor.post("foo");
}

function MyObject(test) {
    this.process = function(msg)
    {
        test.ok(msg);
        test.equal(msg, "foo");
        test.done();
    }
}

