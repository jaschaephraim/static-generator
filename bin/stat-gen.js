#!/usr/bin/env node

// Get command, defaulting to 'start'
var cmd = process.argv[ 2 ] || 'start';

// Execute command, passing any other arguments
require( '../commands/' + cmd )( process.argv.slice( 3 ) );
