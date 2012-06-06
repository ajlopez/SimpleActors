
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
            
        this[n] = makePost(obj, obj[n]);
    }
    
    this.isActor = true;
}

function MessageActorWrapper(obj)
{
    this.isMessageActor = true;
    this.post = makePost(obj, obj.process);
}

function makeFunction(target, fn, args, cb)
{
    return function() { 
        try {
            var result = fn.apply(target, args);
        }
        catch (err)
        {
            if (cb && cb.length == 2)
                cb(err);
            return;
        }
        
        if (cb)
            if (cb.length == 2)
                cb(null, result);
            else
                cb(result);
        else
            return result;
    }
}

function makePost(target, fn)
{
    return function() { 
        var args = asArray(arguments);
        var cb;
        
        // last argument is a callback        
        if (args && args.length > 0 && typeof args[args.length-1] == 'function')
        {
            cb = args[args.length-1];
            args = args.slice(0, args.length-1);
        }        
        // pre-last argument is a callback to be passed to final method invocation
        else if (args && args.length > 1 && typeof args[args.length-2] == 'function' && args[args.length-1] === true)
            args = args.slice(0, args.length-1);

        items.post(makeFunction(target, fn, args, cb)); 
    }
}

// Hack: function receives an array-like object but apply expects an array

function asArray(obj)
{
    if (Array.isArray(obj))
        return obj;
        
    var result = [];
    
    for (var n in obj)
        result[parseInt(n)] = obj[n];
        
    return result;
}

exports.post = function(item)
{
    items.post(item);
}

exports.asActor = function(obj)
{
    return new ActorWrapper(obj);
}

exports.asMessageActor = function(obj)
{
    return new MessageActorWrapper(obj);
}

