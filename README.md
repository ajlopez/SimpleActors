# SimpleActors

Simple Actor Model implementation. It wraps any Javascript object as an actor.

See [Actor Model in Wikipedia](http://en.wikipedia.org/wiki/Actor_model).

When an object is wrapped up as an actor, you can invoke its methods (not its properties), but they are
not execute at the time of invocation. Instead they are executed in the future, in the event loop of Node.js.
An agent can invoke other agents methods.

## Installation

Via npm on Node:

```
npm install simpleactors
```

```js
var simpleactors = require('simpleactors');
```

## Usage

```js
var simpleactors = require('simpleactors');

// ...

var obj = new Downloader();
var actor = simpleactors.asActor(obj);
actor.download('http://...');
```

`.asActor` creates a wrapper object having the same methods that the original one. When you call `actor.download(...)` 
the download process is enqueued to be processed in a future event.

## Development

```
git clone git://github.com/ajlopez/SimpleActors.git
cd SimpleActors
npm install
npm test
```

## Samples

[Web Crawler using agents](https://github.com/ajlopez/SimpleActors/tree/master/samples/WebCrawler)

## Contribution

Feel free to [file issues](https://github.com/ajlopez/SimpleActors) and submit
[pull requests](https://github.com/ajlopez/SimpleActors/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

(Thanks to [JSON5](https://github.com/aseemk/json5). This file is based on that project README.md).