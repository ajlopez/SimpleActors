
var simpleactors = require('../');

exports['MessageActor is not Actor'] = function(test) {
    var obj = new MyObject(test);
    var actor = simpleactors.asMessageActor(obj);
    
    test.equals(simpleactors.isActor(actor), false);
    
    test.done();
}

exports['Actor is Actor'] = function(test) {
    var obj = new MyObject(test);
    var actor = simpleactors.asActor(obj);
    
    test.equals(simpleactors.isActor(actor), true);
    
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

