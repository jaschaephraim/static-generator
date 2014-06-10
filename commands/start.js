/**
 * CLI 'start' command: compiles project, starts development server.
 * @module commands/start
 */

process.env.NODE_ENV = 'development';

/**
 * Starts up development server.
 * @param {string[]} args
 */
module.exports = function( args ) {

  // chdir to project directory if given.
  if ( args.length ) process.chdir( args[ 0 ] );

  console.log( 'starting up...' );
  require( '../server' );

};
