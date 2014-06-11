/**
 * HTML compiler.
 * @module compilers/html
 */

var jade = require( 'jade' );
var loader = require( '../markdown-loader' );

// Set properties available to templates
var locals = {

  pretty: process.env.NODE_ENV === 'development',
  imgUrl: function( path ) {
    return 'img/' + path;
  }

};
locals.livereload_script = process.env.NODE_ENV === 'development'
  ? '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\')'
    + '.split(\':\')[0] + \':35729/livereload.js?snipver=1"></\' + \'script>\')</script>'
  : '';

module.exports.filename = 'index.html';
module.exports.result = '';

var config_path = process.cwd() + '/config.json';

/**
 * Async, compiles HTML.
 * @param {Function} done
 */
module.exports.compile = function( done ) {

  console.log( 'compiling html...' );

  // Reload config.json in case tag list has changed
  delete require.cache[ config_path ];
  locals.config = require( config_path );

  // Populate tag data for templates
  locals.tags = {};
  for ( var i in locals.config.tags ) {
    var tag_slug = locals.config.tags[ i ];
    locals.tags[ tag_slug ] = loader.data.tags[ tag_slug ];
  }

  // Populate content data for templates
  locals.content = loader.data.content;
    
  jade.renderFile( 'jade/index.jade', locals, function( err, html ) {
  
    if ( err ) throw err;
    module.exports.result = html;
    done();
  
  } );

};
