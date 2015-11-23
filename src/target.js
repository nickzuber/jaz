// 
// Target Object
// ============
// Defines the target area of the Jaz program, where the newly
// rendered web pages will have their data loaded into.
// 

  'use strict';

  /**
   * Target object defines the target area of the program, in the sense of
   * where newly rendered web pages will have their content loaded into.
   * @attribute {target} string, defining the target area of the program
   */
  const Target = function(target){
    if(typeof target != 'string'){
      throw new Error("Target objects must be constructed with a string.");
    }

    // Initialize target
    this._target = undefined;

    // Check if target string is of a valid format
    const validIdentifier = /(^(\.|#)?[a-zA-Z](\w+)?)/g;

    // Target defines a class or id or tag
    if(target.match(validIdentifier)){
      // check if identifier exists
      if(!document.querySelector(target)){
        throw new Error("Target identifier was not found in the scope of the web page: " + target + "\nCheck to see you're attempting to reference the correct element.");
      }
      this._target = target;
    }

    // Invalid target
    else{
      throw new Error("Target string is invalid: " + target + "\nYou must define the target with either a reference to a class, ID, or tag name.");
    }

  }

  /**
   * Return the target identifier from the Target object
   * @return string, the identifier of the current target area
   */
  Target.prototype.identifier = function(){
    if(typeof this._target == 'undefined' || !this._target){
      throw new Error("Attempted to access an invalid target value from a Target object.\nMake sure the Target object was constructed correctly.");
    }
    return this._target;
  }
