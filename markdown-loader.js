/**
 * Reads and parses content/tag Markdown files
 * @module file-loader
 */

var fs = require( 'fs' );
var async = require( 'async' );
var front_matter = require( 'front-matter' );
var marked = require( 'marked' );

var month_names = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
var initialized = false;

// Functions that read and parse files, to be called in parallel
var file_loaders = [];

/**
 * Holds parsed files
 * @type {Object}
 */
module.exports.data = {
  tags: {},
  content: {}
};

/**
 * Async, loads content.
 * @param {Function} done
 */
module.exports.load = function( path, done ) {

  if ( !initialized ) {

    async.parallel( [
      generateReadDir( 'tags' ),
      generateReadDir( 'content' )
    ], function() {
      initialized = true;
      doLoad( path, done );
    } );

  } else {
    doLoad( path, done );
  }

};

/**
 * Calls file loading functions.
 * @param  {string[]} path
 * @param  {Function} done
 */
function doLoad( path, done ) {

  // No item, load all content
  if ( !done ) {
    console.log( 'loading content (all)...' );
    done = path;
    async.parallel( file_loaders, done );
    return;
  }

  // Only load specified item
  console.log( 'loading content (' + path + ')...' );
  ( generateLoadFile( path ) )( done );

}

/**
 * Returns async function that reads dir and populates file_loaders array.
 * @param  {string} dirname
 * @return {Function}
 */
function generateReadDir( dirname ) {

  return function( done ) {

    fs.readdir( dirname, function( err, files ) {

      if ( err ) throw err;
      for ( var i in files ) {
        var basename = files[ i ].split( '.' )[ 0 ];
        file_loaders.push( generateLoadFile( [ dirname, basename ] ) );
      }
      done();
    
    } );

  };

}

/**
 * Returns async function that loads and parses specified file.
 * @param {string[]} path
 * @return {Function}
 */
function generateLoadFile( path ) {

  return function( done ) {

    var file_path = path.join( '/' ) + '.md';
    var raw = fs.readFileSync( file_path, { encoding: 'utf8' } );
    var parsed = front_matter( raw );
    var obj = parsed.attributes;
    obj.body = marked( parsed.body );

    var dirname = path[ 0 ];
    var basename = path[ 1 ];

    if ( dirname === 'content' ) {

      // Format date if present
      if ( obj.date ) {
        var date = obj.date;
        obj.date = [
          month_names[ date.getMonth() ],
          date.getDate() + 1,
          date.getFullYear()
        ].join( ' ' );
      }

      module.exports.data.content[ basename ] = obj;

    } else {
      module.exports.data.tags[ basename ] = obj;
    }

    done();

  };

}
