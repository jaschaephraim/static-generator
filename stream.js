/**
 * Stream utilities
 * @module stream
 */

var stream = require( 'stream' );

module.exports = {

  readable: function( fn, cb ) {
    return getStream( 'Readable', 'read', fn, cb );
  },
  writable: function( fn, cb ) {
    return getStream( 'Writable', 'write', fn, cb );
  },
  transform: function( fn, cb ) {
    return getStream( 'Transform', 'transform', fn, cb );
  },

};

/**
 * Creates readable stream that pushes specified string.
 * @param {string} str
 * @return {Stream}
 */
module.exports.readString = function( str ) {

  return module.exports.readable( function() {
    this.push( str );
    str = null;
  } );

};

/**
 * Returns stream of specified type that performs specified function.
 * @param {string} cls
 * @param {string} method
 * @param {Function} fn
 * @param {Function} cb
 * @return {Stream}
 */
function getStream( cls, method, fn, cb ) {

  var s = new stream[ cls ]();
  s[ '_' + method ] = fn;
  if ( cb ) s.on( 'finish', cb );
  return s;
  
}
