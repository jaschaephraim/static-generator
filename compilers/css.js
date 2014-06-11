/**
 * CSS compiler.
 * @module compilers/css
 */

var fs = require( 'fs' );
var stylus = require( 'stylus' );

module.exports.filename = 'app.min.css';
module.exports.result = '';

/**
 * Async, compiles all CSS.
 * @param {Function} done
 */
module.exports.compile = function( done ) {

  console.log( 'compiling css...' );

  // Read main stylus file.
  var styl = fs.readFileSync( 'styl/app.styl', { encoding: 'utf8' } );

  var compress = process.env.NODE_ENV === 'production';
  
  stylus( styl )
    .set( 'filename', module.exports.filename )
    .set( 'compress', compress )
    .use( require( 'axis-css' )() )
    .render( function( err, css ) {

      if ( err ) throw err;
      module.exports.result = css;
      done();
    
    } );

};
