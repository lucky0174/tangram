/*jshint node: true */
'use strict';

var browserify = require('browserify'),
    yargs      = require('yargs'),
    glob       = require('glob'),
    to5ify = require("6to5ify");


var args = yargs.usage('Usage: $0 --debug --require --all').demand([]).argv;


function main() {

    // TODO: look at other 6to5 options (polyfill/runtime, self-contained, etc.)
    var bundle = browserify({ debug: true}).
        add("6to5ify/polyfill").
        transform(to5ify);

    if ((args.require !== undefined) && (args.all !== undefined)) {
        throw new Error('You must specify either the require or all option, not both.');
    }

    if (args.require !== undefined) {
        bundle.require(require.resolve(args.require), { entry: true});
    }

    if (args.all !== undefined) {
        glob.sync(args.all).forEach(function (file) {
            bundle.add(file);
        });
    }

    bundle.bundle().
        on('error', function (err) { console.error(err); }).
        pipe(process.stdout);

}

main();
