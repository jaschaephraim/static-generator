/**
 * CLI 'export' command: compiles and writes static site files.
 * @module commands/export
 */

var path = require( 'path' );

var cwd = process.cwd();
var src_dir;
var dest_dir;

process.env.NODE_ENV = 'production';

/**
 * Performs export.
 * @param {string[]} args
 */
module.exports = function( args ) {

  // Set source and destination.
  switch( args.length ) {
    
    case 0:
      throw new Error( 'specify destination: stat-gen export <dir>' );
    
    case 1:
      src_dir = cwd;
      dest_dir = path.resolve( cwd, args[ 0 ] );
      break;
    
    default:
      src_dir = path.resolve( cwd, args[ 0 ] );
      dest_dir = path.resolve( cwd, args[ 1 ] );
      process.chdir( src_dir );
  
  }

  console.log( 'exporting project ' + src_dir + ' to ' + dest_dir );

  var _ = require( 'underscore' );
  var fs = require( 'fs' );
  var async = require( 'async' );
  var ncp = require( 'ncp' ).ncp;
  var compilers = require( '../compilers' );

  // Create export directory, compile, and write.
  fs.mkdir( dest_dir, function( err ) {
    if ( err && err.code !== 'EEXIST' ) throw err;
    compilers.compileAll( writeAll );
  } );

  /**
   * Writes all types in parallel.
   * @param {Error} err
   */
  function writeAll( err ) {

    if ( err ) throw err;

    async.parallel( [

      function( next ) { write( 'html', next ); },
      function( next ) { write( 'css', next ); },
      function( next ) { write( 'js', next ); },

      // Copy static files
      function( next ) {

        console.log( 'copying static files' );

        var static_files;
        try {
          static_files = fs.readdirSync( 'static' );
        } catch( err2 ) {
          // Return if dir doesn't exist
          if ( err2.code === 'ENOENT' )
            return;
          throw ( err2 );
        }

        var copies = [];
        for ( var i in static_files )
          copies.push( generateCopy( static_files[ i ] ) );
        
        async.parallel( copies, next );

      }

    ], function( err2 ) {
      if ( err2 ) throw err2;
      console.log( 'done' );
    } );

  }
  
  /**
   * Async, writes a given type's files.
   * @param {string} file_type
   * @param {Function} done
   */
  function write( file_type, done ) {

    console.log( 'writing ' + file_type + '...' );
    generateWrite( file_type )( done );
    
  }

  /**
   * Returns async function that writes a file.
   * @param {string} file_type
   * @return {Function}
   */
  function generateWrite( file_type ) {

    return function( next ) {

      var dest_path = dest_dir + '/' + compilers[ file_type ].filename;
      var write_stream = fs.createWriteStream( dest_path );
      write_stream.on( 'finish', next );
      compilers.pipe( file_type, write_stream );
      
    };

  }

  /**
   * Returns async function that copies a static file to export directory.
   * @param {string} src
   * @return {Function}
   */
  function generateCopy( src ) {

    return function( next ) {
      ncp( src_dir + '/static/' + src, dest_dir + '/' + src, next );
    };

  }

};
