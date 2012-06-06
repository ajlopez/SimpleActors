
var simpleactors = require('../');

exports['Simple Post to Actor'] = function(test) {
    test.expect(2);
    
    var actor = new MyObject(test);
	simpleactors.buildActor(actor);
    
    actor.post("foo");
}

exports['Simple Post to Actor with Target Method Name'] = function(test) {
    test.expect(2);
    
    var actor = new MyObject(test);
	simpleactors.buildActor(actor, 'method');
    
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

