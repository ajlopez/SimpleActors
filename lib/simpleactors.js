
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
}

exports.post = function(item)
{
    items.post(item);
}

