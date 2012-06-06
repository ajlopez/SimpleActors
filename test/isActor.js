
var simpleactors = require('../');

exports['asActor is Actor'] = function(test) {
    var obj = new MyObject(test);
    var actor = simpleactors.asActor(obj);
    
    test.equals(simpleactors.isActor(actor), true);
    
    test.done();
}

exports['Build Actor is an Actor'] = function(test) {
    var obj = new MyObject(test);
	simpleactors.buildActor(obj);
    
    test.equals(simpleactors.isActor(obj), true);
    
    test.done();
}

exports['null is not an Actor'] = function(test) {
	test.equals(simpleactors.isActor(null), false);
	test.done();
}

exports['Number is not an Actor'] = function(test) {
	test.equals(simpleactors.isActor(42), false);
	test.done();
}

exports['String is not an Actor'] = function(test) {
	test.equals(simpleactors.isActor('foo'), false);
	test.done();
}

exports['Object is not an Actor'] = function(test) {
	test.equals(simpleactors.isActor({ name: 'Adam' }), false);
	test.done();
}

function MyObject(test) {
    this.process = function(msg)
    {
        test.ok(msg);
        test.equal(msg, "foo");
        test.done();
    }
}

