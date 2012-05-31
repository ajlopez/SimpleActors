
var simpleactors = require('../');

exports['Simple Post'] = function(test) {
    test.expect(1);
    
    function todo(msg) {
        test.equal(msg, "foo");
        test.done();
    }
    
    simpleactors.post(function() {
        todo("foo");
    });
}

exports['Post to Object'] = function(test) {
    test.expect(2);
    
    var obj = new MyObject(test);
    
    simpleactors.post(function() {
        obj.method("foo");
    });
}

function MyObject(test) {
    this.method = function(msg)
    {
        test.ok(msg);
        test.equal(msg, "foo");
        test.done();
    }
};

