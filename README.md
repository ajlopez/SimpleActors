# SimpleActors

Simple Actor Model implementation. It wraps any Javascript object as an actor.

See [Actor Model in Wikipedia](http://en.wikipedia.org/wiki/Actor_model).

When an object is wrapped up as an actor, you can invoke its methods (not its properties), but they are
not execute at the time of invocation. Instead they are executed in the event loop of Node.js.
An agent can invoke other agents methods, or regular objects.

This model encourage the writing of application consisting in actors that collaborates using message passing.
In this module, method invocation is like a message passing operation, that not returns value. The application
that uses actor model doesn't need continuation callbacks: each agent receives messages as method invocation, 
and produces new messages calling other agent methods.

As usual, inside a method, you can use all Node.js/Javascript power. It's recommended that any intensive IO work
were done in asynchronous way, if possible.

## Installation

Via npm on Node:

```
npm install simpleactors
```

Reference in your program:

```js
var simpleactors = require('simpleactors');
```

## Usage

```js
// Your object
var obj = new Downloader();
// Wrapped up as an actor
var actor = simpleactors.asActor(obj);
// Usual method invocation, wo/waiting the result
actor.download('http://...');
```

`.asActor` creates a wrapper object having the same methods that the original one. When you call `actor.download(...)` 
the download process is enqueued to be processed in a future event.

### Callback

It's not part of actor features, but you can retrieve the result of a method invocation if you add a callback function
as last parameter:

```js
// Your object
var obj = {
	add: function(x, y) { return x+y; }
};
// Wrapped up as an actor
var actor = simpleactors.asActor(obj);
// Usual method invocation, but with additional callback
actor.add(2, 3, function(result) {
	console.log(result); // <-- 5
});
```

A callback can receive an error parameter:

```js
// Your object
var obj = {
	add: function(x, y) { return x+y; }
};
// Wrapped up as an actor
var actor = simpleactors.asActor(obj);
// Usual method invocation, but with additional callback
actor.add(2, 3, function(err, result) {
	console.log(result); // <-- 5
});
```

The module detects at runtime if the callback has one or two arguments. In the latter case, the first one is
considered the err receiver, and the second is the result of invocation.

If the final real method to invoke admits a callback, you MUST add an addition parameter true (mandatory):

```js
// Your object
var fs = require('fs');
// Wrapped up as an actor
var fsactor = simpleactors.asActor(fs);
// Contribed example, but it works
fsactor.realpath('.', function(err, result) {
	console.log(result); // <-- the full path of current directory
	},
	true  <-- additional parameter
	);
```

### Messages

TBD

## Development

```
git clone git://github.com/ajlopez/SimpleActors.git
cd SimpleActors
npm install
npm test
```

## Samples

[Web Crawler using agents](https://github.com/ajlopez/SimpleActors/tree/master/samples/WebCrawler) sample shows
how you can create an application that don't depend on calling a method and receiving a response: each agent
does its works, receiving calls and sending calls to other agents.

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleActors) and submit
[pull requests](https://github.com/ajlopez/SimpleActors/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

(Thanks to [JSON5](https://github.com/aseemk/json5) by [aseemk](https://github.com/aseemk). 
This file is based on that project README.md).