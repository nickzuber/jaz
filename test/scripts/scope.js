// 
// Scope Object
// ============
// Defines the scope of the Jaz program and handles
// any sort of maintenance with this particular
// area of the program.
// 
// Scope can be defined as the following:
// 
//  *         |    all links
//  data-*    |    a data attribute with its value (value is ignored)
//  .*        |    a certain class name
//  #*        |    a certain id name
// 
// The scope will encapulate all anchor elements with the specified
// property.
// 

define([], function(){

  'use strict';

  /**
   * Scope object defines the scope of the program, in the sense of
   * which links will be affected by Jaz.
   * @attribute {scope} string, defining the scope of the program
   */
  const Scope = function(scope){
    if(typeof scope != 'string'){
      throw new Error("Scope objects must be constructed with a string.");
    }

    // Initialize scope
    this._scope = undefined;

    // Check for wildcard flag
    if(scope === '*'){
      // 'a' encapsulates every link on a page
      this._scope = 'a';
      return;
    }

    // Check if scope string is of a valid format
    const validClassOrID = /(^(\.|#)[a-zA-Z](\w+)?)/g;
    const validDataAttribute = /(data-[a-zA-Z](\w+)?)/g;

    // Scope defines a class or id
    if(scope.match(validClassOrID)){
      // check if identifier exists
      if(!document.querySelector("a" + scope)){
        throw new Error("Scope identifier was not found in the scope of the web page: " + scope + "\nCheck to see you're attempting to reference the correct element.");
      }
      this._scope = "a" + scope;
    }

    // Scope defines a data-* attribute name
    else if(scope.match(validDataAttribute)){
      // check if identifier exists
      if(!document.querySelector("a[" + scope + "]")){
        throw new Error("Scope identifier was not found in the scope of the web page: " + scope + "\nCheck to see you're attempting to reference the correct element.");
      }
      this._scope = "a[" + scope + "]";
    }

    // Invalid scope
    else{
      throw new Error("Scope string is invalid: " + scope + "\nYou must define the scope with either a reference to a class, ID, or data-* attribute name.");
    }

  }

  /**
   * Return the scope identifier from the Scope object
   * @return string, the identifier of the current scope
   */
  Scope.prototype.identifier = function(){
    return this._scope;
  }

  // return module - will remove in production
  return Scope;

});