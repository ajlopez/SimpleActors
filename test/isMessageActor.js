
var simpleactors = require('../');

exports['MessageActor is MessageActor'] = function(test) {
    var obj = new MyObject(test);
    var actor = simpleactors.asMessageActor(obj);
    
    test.ok(simpleactors.isMessageActor(actor));
    
    test.done();
}

exports['Actor is not MessageActor'] = function(test) {
    var obj = new MyObject(test);
    var actor = simpleactors.asActor(obj);
    
    test.equals(simpleactors.isMessageActor(actor), false);
    
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

