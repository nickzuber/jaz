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

define([], function(){

  /**
   * Intermission constructor takes a simple object containing anywhere from
   * zero, one, or two functions. If the object is null, false, or empty, it
   * will be assumed that no transition is requested.
   * @attribute {_intermission} function, to execute when new page is rendering
   */
  const Intermission = function(functionsObject){
    if(typeof functionsObject == 'undefined' || !functionsObject){
      console.warn("Intermission object is undefined; assumed no Intermission is requested.");
      this.loading = null;
      this.callback = null;
      return;
    }
    if(typeof functionsObject != 'object'){
      throw new Error("Intermission objects must be constructed with an basic object containing the loading function and a callback function.");
    }

    // Assume we have an object containing two attributes defined as functions
    // labelled 'loading' and 'callback'
    const loading = functionsObject.loading;
    const callback = functionsObject.callback;
    if(typeof callback != 'function' || typeof loading != 'function'){
      throw new Error("Error when defining intermission and callback.\nMake sure they are both defined as valid functions.");
    }
    
    // 

    this.loading = loading;
    this.callback = callback;

  } 

  Intermission.prototype.fire = function(){
    if(typeof this.loading == 'function' && this.loading){
      this.loading();
    }
  }

  Intermission.prototype.done = function(){
    if(typeof this.callback == 'function' && this.callback){
      this.callback();
    }
  }

  // return module - will remove in production
  return Intermission;

});