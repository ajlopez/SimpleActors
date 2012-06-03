
var simpleactors = require('../'),
    fs = require('fs');

var obj = {
	add: function(x, y) { return x + y; },
    eval: function(text) { return eval(text); }
};

var actor = simpleactors.asActor(obj);
var fsactor = simpleactors.asActor(fs);

exports['Invoke with callback'] = function(test) {
    test.expect(2);

	actor.add(1, 2, function(result) {
		test.ok(result);
		test.equal(result, 3);
		test.done();
	});
}

exports['Invoke with callback with two arguments'] = function(test) {
    test.expect(3);

	actor.add(1, 2, function(err, result) {
        test.ok(!err);
		test.ok(result);
		test.equal(result, 3);
		test.done();
	});
}

exports['Get error'] = function(test) {
    test.expect(2);

	actor.eval("a+1", function(err, result) {
        test.ok(err);
        test.ok(err.toString().indexOf('Reference') >= 0);
		test.done();
	});
}

exports['Invoke using async callback'] = function(test) {
    test.expect(2);
    
    var path = fs.realpathSync('.');

	fsactor.realpath(".", function(err, result) {
        test.ok(!err);
        test.equal(result, path);
		test.done();
	},
    true // use the callback in final invocation
    );
}
