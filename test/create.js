
var simpleactors = require('../');

exports['create system'] = function(test) {
    var system = simpleactors.create('MySystem');
    
    test.ok(system);
    test.equal(typeof system, 'object');
    test.done();
}
