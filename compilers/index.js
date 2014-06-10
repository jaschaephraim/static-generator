/**
 * Object holding compilers and utilities.
 * @module compilers
 */

var async = require( 'async' );
var stream = require( '../stream' );
var loader = require( '../markdown-loader' );

module.exports = {

  html: require( './html' ),
  css: require( './css' ),
  js: require( './js' )

};

/**
 * Async function that compiles everything
 * @param {Function} done
 */
module.exports.compileAll = function( done ) {

  loader.load( function() {

    async.parallel( [

      module.exports.html.compile,
      module.exports.css.compile,
      module.exports.js.compile
      
    ], done );

  } );

};

/**
 * Pipes given file type into given stream.
 * @param {string} type
 * @param {Stream} target_stream
 */
module.exports.pipe = function( type, target_stream ) {
  var compiled = module.exports[ type ].result;
  stream.readString( compiled ).pipe( target_stream );
};
