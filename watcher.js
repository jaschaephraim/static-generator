/**
 * Starts watcher for recompiling/live refresh, exports nothing.
 * @module watcher
 */

var _ = require( 'underscore' );
var path = require( 'path' );
var gaze = require( 'gaze' );
var request = require( 'request' );
var compilers = require( './compilers' );
var loader = require( './markdown-loader' );

// Start watcher
gaze( [
  '**',
  '!{bower_components,bower_components/**}'
], watching );

/**
 * Callback for starting watcher, performs recompile and refresh on change.
 * @param {Error} err
 * @param {Object} watcher
 */
function watching( err, watcher ) {

  if ( err ) throw err;

  watcher.on( 'all', function( evt, filepath ) {

    var changed = path.relative( process.cwd(), filepath );
    var changed_ext = path.extname( changed );

    console.log( evt, changed );

    switch( changed_ext ) {

      case '.md':
        var type = path.dirname( changed );
        var item = path.basename( changed ).split( '.' )[ 0 ];

        if ( evt === 'deleted' ) {
          delete loader.data[ type ][ item ];
          compileRefresh( 'html' );
        } else {
          loader.load( [ type, item ], _.partial( compileRefresh, 'html' ) );
        }
        break;

      case '.json':
      case '.jade':
        compileRefresh( 'html' );
        break;

      case '.styl':
        compileRefresh( 'css' );
        break;

      case '.js':
        compileRefresh( 'js' );
        break;

      default:
        refresh( compilers.html.filename );

    }
  
  } );

}

/**
 * Compile and livereload given type.
 * @param {string} type
 */
function compileRefresh( type ) {
  compilers[ type ].compile( _.partial( refresh, compilers[ type ].filename ) );
}

/**
 * Send livereload request
 * @param {string} filename
 */
function refresh( filename ) {

  if ( _.isArray( filename ) ) filename = filename.join( ',' );
  console.log( 'requesting refresh: ' + filename );
  request( 'http://localhost:35729/changed?files=' + filename );

}
