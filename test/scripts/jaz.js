/*! 
 *  Jaz | main entry point
 */

const Scope = function(){
  
}

const Transition = function(){
  
}



/**
 * Constuct base object with respective private data
 * @attribute scope which links are to be affected by Jaz
 * @attribute transition callback function that executes while new page is rendering
 */
const Jaz = function(){
  this.scope = new Scope();
  this.transition = new Transition();
};

Jaz.prototype.remoteBlockRouting = function(){
  if(typeof this.scope == 'object' && this.scope){
    console.log('invoked');
  }else{
    throw new Error("Error: undefined or invalid scope.");
  }
}