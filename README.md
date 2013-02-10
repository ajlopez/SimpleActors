# SimpleActors

Simple Actor Model implementation.

See [Actor Model in Wikipedia](http://en.wikipedia.org/wiki/Actor_model).

## Description

This implementation is inspired in [Akka actor implementation](http://doc.akka.io/docs/akka/2.1.0/general/index.html).

This model encourage the writing of application consisting in actors that collaborates using message passing.
In this module, method invocation is like a message passing operation, that not returns value. The application
that uses actor model doesn't need continuation callbacks: each agent receives messages as method invocation, 
and produces new messages calling other agent methods.

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

Create a system application:
```js
var system = simpleactors.create('webcrawler');
```

Create an object of class `Downloader`, wrap it as an actor, and returns an actor reference:
```js
var ref = system.actorOf(Downloader, 'downloader');
```

Alternatively, you can use an already create object as first parameter:
```js
var downloader = new Downloader();
var ref = system.actorOf(downloader, 'downloader');
```

The second parameter is optional. A name is automatically assigned if the second parameter is missing.

Sends a message to an actor reference:
```js
ref.tell(msg);
```

An object wrapped as an actor has:
- `context`: Actor context, with information about the actor environment.
- `self`: This actor reference.

It should implement the function:
- `receive(msg)`: Process an incoming message

Example:
```js
function Logger() {
	this.receive = function (msg) {
		console.log(msg);
	}
}

var system = simpleactors.create('mysys');
var ref = system.actorOf(Logger);
ref.tell('Hello, world');
```

How to create an actor in our actor object:
```js
this.context.actorOf(MyActor, name);
```

How to get an actor reference in our actor object:
```js
var ref = this.context.actorFor(path);
```

Examples:
```js
var refchild = this.context.actorFor('mychild'); // child of current actor
var refactor = this.context.actorFor('/myroot/myactor'); // actor in current system
```

How to get an actor reference in a system:
```js
var ref = system.actorFor(path);
```
Example:
```js
var ref = system.actorFor('/myroot/myactor'); // actor in current system
ref.tell('Hello');
```

An actor system can run in many nodes (running process). 
```js
var node = simpleactors.createNode(port [, host]);
```

Example creating a node, a system, and two actors:
```js
var node = simpleactors.createNode(3000);
var system = node.create('mysys');
var actor1 = system.actorOf(MyActor, 'actor1');
var actor2 = actor1.context.actorOf(MyActor, 'actor2');
// actor1.self.path === 'sactors://mysys@localhost:3000/actor1'
// actor2.self.path === 'sactors://mysys@localhost:3000/actor1/actor2'
```

A node can connect to another running node. In node A:
```js
var node = simpleactors.createNode(3000);
var system = node.create('mysys');
var actor1 = system.actorOf(MyActor, 'actor1');
node.start();
```

In node B:
```js
var node = simpleactors.createNode(3001);
var system = node.create('mysys');
node.connect(3000);
var remoteref = system.actorFor('sactors://mysys@localhost:3000/actor1');
remoteref.tell('hello');
```

## Development

```
git clone git://github.com/ajlopez/SimpleActors.git
cd SimpleActors
npm install
npm test
```

## Samples

[Web Crawler using Agents](https://github.com/ajlopez/SimpleActors/tree/master/samples/WebCrawler) sample shows
how you can create an application that don't depend on calling a method and receiving a response: each agent
does its works, receiving calls and sending calls to other agents.

[Web Crawler using Remote Agents](https://github.com/ajlopez/SimpleActors/tree/master/samples/WebCrawlerRemote) sample has a
server that launch the web crawling process, and many clients can be launched that collaborates with the download and
harvest of new links to process (Work in Progress, Refactoring).

## Versions

- 0.0.1: Published
- 0.0.2: Under development, in master.

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleActors) and submit
[pull requests](https://github.com/ajlopez/SimpleActors/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

(Thanks to [JSON5](https://github.com/aseemk/json5) by [aseemk](https://github.com/aseemk). 
This file is based on that project README.md).