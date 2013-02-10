
var simpleactors = require('../');

exports['parse path'] = function(test) {
    var result = simpleactors.parsePath('sactors://mysys/actor');
    
    test.ok(result);
    test.ok(result.protocol);
    test.ok(result.system);
    test.ok(result.path);
    
    test.equal(result.protocol, 'sactors');
    test.equal(result.system, 'mysys');
    test.equal(result.path, '/actor');
    
    test.done();
}

exports['parse path with server'] = function(test) {
    var result = simpleactors.parsePath('sactors://mysys@localhost/actor');
    
    test.ok(result);
    test.ok(result.protocol);
    test.ok(result.system);
    test.ok(result.path);
    test.ok(result.server);
    
    test.equal(result.protocol, 'sactors');
    test.equal(result.system, 'mysys');
    test.equal(result.path, '/actor');
    test.equal(result.server, 'localhost');
    
    test.done();
}

exports['parse path with server and port'] = function(test) {
    var result = simpleactors.parsePath('sactors://mysys@localhost:3000/actor');
    
    test.ok(result);
    test.ok(result.protocol);
    test.ok(result.system);
    test.ok(result.path);
    test.ok(result.server);
    test.ok(result.port);
    
    test.equal(result.protocol, 'sactors');
    test.equal(result.system, 'mysys');
    test.equal(result.path, '/actor');
    test.equal(result.server, 'localhost');
    test.equal(result.port, 3000);
    
    test.done();
}
