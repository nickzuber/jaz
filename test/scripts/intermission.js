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

  'use strict';

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

  /**
   * Fires the loading intermission function and when it finishes
   * the callback is called (usually the function that continutes
   * routing process)
   * @param {callback} the function to be called when the loading
   *                   intermission completes
   * @param {_delay} the delay configured in the respective Jaz object
   * @return {void}
   */
  Intermission.prototype.fire = function(callback, _delay){
    if(typeof this.loading == 'function' && this.loading){
      var load = new Promise(function(fulfill, reject){
        try{
          this.loading();
          setTimeout(function(){
            fulfill(console.log('Intermission loading fired correctly.'));
          }, _delay);
        }catch(e){
          reject(new Error("Intermission loading function was recjected.\nPerhaps the loading function given itself throws an error; check your loading function.\nError: " + e.getMessage));
        }
      }.bind(this));
      load.then(callback);
    }else{
      callback();
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