/**
 * Starts development server, exports nothing.
 * @module server
 */

var express = require( 'express' );
var livereload = require( 'tiny-lr' )();
var compilers = require( './compilers' );

var server = express();
server.set( 'view engine', 'jade' );
server.set( 'views', process.cwd() + '/jade' );

// Serve static files
server.use( express.static( 'static' ) );

// Serve CSS
server.get( '/' + compilers.css.filename, function( req, res ) {
  respond( 'css', res );
} );

// Serve JS
server.get( '/' + compilers.js.filename, function( req, res ) {
  respond( 'js', res );
} );

// Serve HTML by default
server.get( '*', function( req, res ) {
  respond( 'html', res );
} );

// Compile everything, then start up.
compilers.compileAll( function( err ) {
  
  if ( err ) throw err;

  // Start watcher.
  console.log( 'watching files' );
  require( './watcher' );

  // Listen for live reload.
  livereload.listen( 35729, function() {
    console.log( 'livereload listening on port 35729' );
  } );

  // Start express server.
  server.listen( 3000, function() {
    console.log( 'listening on port 3000, ctrl-c to exit' );
  } );

} );

/**
 * Send compiled code with appropriate mime type
 * @param {string} file_type
 * @param {Stream} res
 */
function respond( file_type, res ) {
  res.type( file_type );
  compilers.pipe( file_type, res );
}
