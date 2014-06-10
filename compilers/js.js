/**
 * JavaScript compiler.
 * @module compilers/js
 */

var uglify = require( 'uglify-js' );
var stream = require( '../stream' );

var cwd = process.cwd();
var config = require( cwd + '/config.json' );

var no_parse = config.browserify_noparse;
var browserify = require( 'browserify' )( { noParse: no_parse } );
browserify.transform( { global: true }, 'debowerify' );
browserify.add( cwd + '/js/app.js' );

module.exports.filename = 'app.min.js';
module.exports.result = '';

/**
 * Async, compiles all JS.
 * @param {Function} done
 */
module.exports.compile = function( done ) {

  console.log( 'compiling js...' );

  var compiled_js = '';
  var save_stream = stream.writable( function( js_buf, enc, next ) {

    compiled_js += js_buf.toString();
    next();

  }, function( err ) {

    var js = process.env.NODE_ENV === 'production'
      ? uglify.minify( compiled_js, { fromString: true } ).code
      : compiled_js;
      
    module.exports.result = js;
    done( err );

  } );

  browserify.bundle().pipe( save_stream );

};
