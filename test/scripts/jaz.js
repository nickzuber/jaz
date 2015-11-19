/*! Jaz v1.1.0
 // alpha version 1.0  
 // MIT Licensed http://opensource.org/licenses/MIT
 */



// 
// Status Object
// ============
// Handles the state of the program at any given moment.
// It's purpose is to avoid overwhelming the program with
// input and commands; this simply discards extraneous 
// commands while the program is running and does not queue 
// them for later use.
// 

/**
 * Status object controls the current state of the program.
 * @attribute {inProcess} current state (true if event is firing)
 * @attribute {loadSuccess} returns true if page load succeeded
 */
const Status = {
  inProcess: false,
  loadSuccess: false
}















// 
// Scope Object
// ============
// Defines the scope of the Jaz program and handles
// any sort of maintenance with this particular
// area of the program.
// 

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
    this._scope = 'a';
  }

}

/**
 * Return the scope identifier from the Scope object
 * @return {_scope} string, the identifier of the current scope
 */
Scope.prototype.identifier = function(){
  return this._scope;
}

















// 
// Intermission Object
// ===================
// Specifies and intermission function that is to fire while
// the program is changing states. This consists of a function
// that will run while the new page is rendering and loading,
// and a callback to that function to execute when the page
// has finished rendering and loading, and the intermission
// function has finished.
// 

/**
 * Intermission constructor takes a simple object containing anywhere from
 * zero, one, or two functions. If the object is null, false, or empty, it
 * will be assumed that no transition is requested.
 * @attribute {_intermission} function, to execute when new page is rendering
 */
const Intermission = function(functionsObject){
	console.log(functionsObject)
  if(typeof functionsObject == 'undefined' || !functionsObject){
    console.warn("Intermission object is undefined; assumed no Intermission is requested.");
    this.loading = null;
    return;
  }
  if(typeof functionsObject != 'object'){
    throw new Error("Intermission objects must be constructed with an basic object containing the loading function and (optional) a callback function.");
  }

  // Assume we have an object containing two attributes defined as functions
  // labelled 'loading' and 'callback'
  const loading = functionsObject.loading;
  const callback = functionsObject.callback;
  if(typeof callback =='undefined' || typeof loading == 'undefined'){
    throw new Error("Error when defining intermission and callback.");
  }
  
  // 

}













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

/**
 * Construct base object with respective private data
 * @attribute {scope} which links are to be affected by Jaz
 * @attribute {transition} object, holds functions that executes while new page is rendering
 *                         and a callback for when the page finishes rendering.
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
  
  // Confirm intermission is a simple object
  if(typeof intermission != 'object'){
    throw new Error("Intermission must be defined as a simple object.");
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

window.Jaz = Jaz;