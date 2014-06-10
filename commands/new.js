/**
 * CLI 'new' command: copies ../template to destination.
 * @module commands/new
 */

 var path = require( 'path' );
 var ncp = require( 'ncp' ).ncp;
 
 var template_path = path.resolve( __dirname, '../template' );

/**
 * Copies template to new project dir.
 * @param {string[]} args
 */
module.exports = function( args ) {

  // No project name given.
  if ( !args.length ) throw new Error( 'specify project name: stat-gen new <dir>' );

  var new_name = args[ 0 ];
  console.log( 'creating new project ' + new_name + '...' );
  
  // Copy template directory to new project.
  ncp( template_path, new_name, function( err ) {
    if ( err ) throw err;
    console.log( 'done' );
  } );

};
