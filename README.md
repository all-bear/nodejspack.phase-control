# Phase-control

Phase-control allows to split application initialization to *phases*.
These phases will be executed sequentially (asynchronous phases will be run as synchronous).

## Install

    $ npm install phase-control

## Usage

Phase-control is generally applicable to any Node.js application or application
framework.  [Express](http://expressjs.com/) will be used below.

#### Mixin Phase-control

Create a new application and mixin the phase-control module.

```javascript
var express = require('express')
  , phase-control = require('phase-control');

var app = phase-control(express());
```

Once mixed-in, the application will have function `app.phase(phaseName, path to file or path to directory or function)`.

#### Register Phases

An application proceeds through a sequence of phases, in order to prepare
itself to handle requests.  Modules need to be configured, databases need to be
connected, and routes need to be drawn.

Phase-control packages phases for these common scenarios:

```javascript
app.phase('initialize','config/initializers'); //will work like phase with path to file for all files
app.phase('init routers','routes.js'); //will require routes.js

```

routes.js

```javascript
module.exports = function() {
    //app used like this
    this.use('/admin', admin);
}

```

or routes.js may be asynchronous. In this way it will be run by phase-control like synchronous and next phase will wait until this is over.

```javascript
module.exports = function(done) { //callback name 'done' is mandatory
    //app used like this
    var self = this;

    setTimeout(function() {
        self.use('/admin', admin);
    }, 300);
}

```

Custom phases can be registered as well, and come in synchronous and
asynchronous flavors:

```
app.phase('some phase', function() {
  // synchronous phase
});

app.phase('some phase', function(done) { //callback name 'done' is mandatory
  setTimeout(function() {
    // asynchronous phase
    done();
  }, 1000);
});
```

This allows you to split off your initialization steps into separate, organized
and reusable chunks of logic.

## Tests

    $ npm install
    $ npm test

## License

[The MIT License](http://opensource.org/licenses/MIT)
