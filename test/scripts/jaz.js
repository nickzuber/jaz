/*! Jaz v1.1.0
 // alpha version 1.0  
 // MIT Licensed http://opensource.org/licenses/MIT
 */

// 
// Jaz Object
// ==========
// Specifies and intermission function that is to fire while
// the program is changing states. This consists of a function
// that will run while the new page is rendering and loading,
// and a callback to that function to execute when the page
// has finished rendering and loading, and the intermission
// function has finished.
//

define(['Status', 'Scope', 'Intermission'], function(Status, Scope, Intermission){ 

  /**
   * Construct base object with respective private data
   * @attribute {scope} which links are to be affected by Jaz
   * @attribute {transition} object, holds functions that executes while new page is rendering
   * and a callback for when the page finishes rendering.
   */
  const Jaz = function(){
    this.scope = undefined;
    this.intermission = undefined;
  };

  /**
   * Construct the Jaz object
   * @param {config} object, holds configuration settings of scope and intermission
   */
  Jaz.prototype.config = function(config){
    if(typeof config != 'object' || !config){
      throw new Error("Configuration settings must be an object.");
    }

    // Assume our config object is defined with two attributes
    try{
      const scope = config.scope;
      const intermission = config.intermission;
    }
    catch(e){
      throw new Error("Configuration object must be constructed with a string, and an object of functions: " + e.message);
    }
    
    this.scope = new Scope(scope);
    this.intermission = new Intermission(intermission);
  };

  /**
   * Blocks the links within scope of the program from executing their
   * default routing. We will prepare these links with the Jaz routing
   * property.
   */
  Jaz.prototype.remoteBlockRouting = function(){
    if(typeof this.scope == 'object' && this.scope){
      console.log('invoked');
    }else{
      throw new Error("Error: undefined or invalid scope.");
    }

  }

  /**
   * Begin the process of rerouting links within the scope and listening
   * to page requests.
   */
  Jaz.prototype.invoke = function(){
    console.log('invoke invoked (lol)');
  }


  // Place Jaz onto the global scope
  window.Jaz = Jaz;

  // return module - will remove in production
  return Jaz;

});