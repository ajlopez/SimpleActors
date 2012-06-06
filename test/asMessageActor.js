
var simpleactors = require('../');

exports['Simple Post to Actor'] = function(test) {
    test.expect(2);
    
    var obj = new MyObject(test);
    var actor = simpleactors.asMessageActor(obj);
    
    actor.post("foo");
}

exports['Simple Post to Actor with Target Method Name'] = function(test) {
    test.expect(2);
    
    var obj = new MyObject(test);
    var actor = simpleactors.asMessageActor(obj, 'method');
    
    actor.post("bar");
}

function MyObject(test) {
    this.process = function(msg)
    {
        test.ok(msg);
        test.equal(msg, "foo");
        test.done();
    }
    
    this.method = function(msg)
    {
        test.ok(msg);
        test.equal(msg, "bar");
        test.done();
    }
}

