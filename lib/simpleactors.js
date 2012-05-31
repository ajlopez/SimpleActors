
var EventEmitter = process.EventEmitter;

var items = new EventEmitter();

items.post = function(item)
{
    items.emit('item', item);
}

items.on('item', function(item)
{
    if (typeof item == 'function')
        item();
});

function ActorWrapper(obj)
{
    var agent = this;
    
    for (n in obj)
    {
        if (typeof obj[n] != 'function')
            continue;
            
        this[n] = function()
        {
            items.post(makePost(obj, obj[n], arguments));
        }
    }
}

function makePost(target, fn, args)
{
    return function() { fn.apply(target, args); }
}

exports.post = function(item)
{
    items.post(item);
}

exports.asActor = function(obj)
{
    return new ActorWrapper(obj);
}

