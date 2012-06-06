
var simpleactors = require('../');

exports['Message Post with Sender'] = function(test) {
    test.expect(1);
    
    var actor1 = new Sum(test);
    var actor2 = new Sum(test);
    simpleactors.buildActor(actor1);
    simpleactors.buildActor(actor2);
    
    actor1.post({ value: 4, sum: 0 }, actor2);
}

function Sum(test) {
    this.process = function(msg, sender)
    {
        var newmsg = { value: msg.value-1, sum: msg.sum + msg.value };

        if (newmsg.value == 0)
        {
            test.equal(newmsg.sum, 1+2+3+4);
            test.done();
            return;
        }

        sender.post(newmsg, this);
    }
}

