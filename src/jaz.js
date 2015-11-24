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

  'use strict';

  /**
   * Status object controls the current state of the program.
   * @attribute {inProcess} current state (true if event is firing)
   */
  const Status = {
    inProcess: false
  }


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

'use strict';

/**
 * Construct base object with respective private data
 * @attribute {scope} which links are to be affected by Jaz
 * @attribute {transition} object, holds functions that executes while new page is rendering
 * and a callback for when the page finishes rendering.
 */
const Jaz = function(){
  this.status = Status;
  this.scope = undefined;
  this.intermission = undefined;
  this.delay = 0;
  this.targetArea = undefined;
};

/**
 * Construct the Jaz object
 * @param {config} object, holds configuration settings of scope and intermission
 */
Jaz.prototype.config = function(config){

  var scope;
  var intermission;
  var targetArea;

  if(typeof config != 'object' || !config){
    throw new Error("Configuration settings must be an object.");
  }

  // Assume our config object is defined with two attributes
  try{
    scope = config.scope;
    intermission = config.intermission;
    targetArea = config.targetArea;
  }
  catch(e){
    throw new Error("Configuration object must be constructed with a string, and an object of functions: " + e.message);
  }

  // Check to see if a delay is requested
  if(typeof config.delay == 'number' && config.delay){
    this.delay = config.delay;
  }
  
  this.scope = new Scope(scope);
  this.intermission = new Intermission(intermission);
  this.targetArea = new Target(targetArea);
};

/**
 * Blocks the links within scope of the program from executing their
 * default routing. We will prepare these links with the Jaz routing
 * property.
 */
Jaz.prototype.remoteBlockRouting = function(){
  if(typeof this.scope != 'object' || !this.scope){
    throw new Error("Error: undefined or invalid scope.");
  }

  // Initialize container for links within scope
  var encapsulatedLinks = [];

  // Grab all links in scope
  for(var i=0; i<document.querySelectorAll(this.scope.identifier()).length; i++){
    encapsulatedLinks.push(document.querySelectorAll(this.scope.identifier())[i]);
  }

  // Attached event to links in scope that block default routing
  // and attach custom Jaz routing method
  encapsulatedLinks.map(function(a){
    var target = a.href;
    a.addEventListener("click", function(e){
      this.reconfigureRouting(e, target);
    }.bind(this));
  }.bind(this));

}

/**
 * The event that is attatched to a link, preventing it from its default
 * routing and adding the custom Jaz routing method.
 * @param {e} object, reference to the link that is clicked
 * @param {target} string, the address of our target destination
 */
Jaz.prototype.reconfigureRouting = function(e, target){
  e.preventDefault();

  // If Jaz is already routing, ignore other requests
  if(this.status.inProcess){
    console.warn("Process is already active; all subsequent actions invoked while this process is running will be ignored.")
    return;
  }

  // Update status
  this.status.inProcess = true;

  // Fire intermission function and then continue process when that finishes
  this.intermission.fire(function(){
    this.continueProcess(e, target);
  }.bind(this), this.delay);
}

Jaz.prototype.continueProcess = function(e, target){
  // Update current page state (@via history API)
  window.history.pushState({}, '', target);

  // href string value
  var request;

  console.log('Route path: ' + target);

  if(window.XMLHttpRequest){
    request = new XMLHttpRequest();
  }else{
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }

  // Open request
  request.open("GET", target, true);

  request.onreadystatechange = function(){
    if(request.readyState == XMLHttpRequest.DONE){
      if(request.status == 200){
        
        // Parse loaded HTML and repopulate targetArea
        // Rerender HTML and finish processes
        this.parseHTML(request.responseText);
      }
      else{
        // Fall back to default routing
        window.location = target;
        throw new Error("AJAX load failed: invalid status returned: " + request.status);
      }
    }
  }.bind(this);

  // Attempt to invoke request
  try{
    request.send();
  }
  catch(e){
    console.warn("Error: Connection refused.\nFall back initiated.");
    window.location = target;
  }
}

/**
 * Begin the process of rerouting links within the scope and listening
 * to page requests.
 */
Jaz.prototype.listen = function(){
  console.warn('Jaz is listening...');
  // Push currently configured instance of Jaz object onto global scope.
  // This is needed for handling popstate changes (user going back/forward)
  window.Jaz_Reference = this;
  this.remoteBlockRouting();
}

/**
 * Create virtual DOM, load in raw HTML, parsed to extract 
 * target area data and return that data.
 * @param {rawHTML} string, HTML in the form of a string
 * @return target area data
 */
Jaz.prototype.parseHTML = function(rawHTML){
  // Construct a virtual DOM to contain and parse our raw HTML
  const DOM = document.createElement('html');
  DOM.innerHTML = rawHTML;

  // Extract targetArea
  const renderedData = DOM.querySelector(this.targetArea.identifier());

  // Inject targetArea with new content
  document.querySelector(this.targetArea.identifier()).innerHTML = renderedData.innerHTML;

  // Fix any JavaScript in newly rendered content
  var renderedInternalScripts = [];
  var renderedExternalScripts = [];
  for(var i=0; i<document.querySelectorAll(this.targetArea.identifier() + " script").length; i++){
    // If not external
    if(!document.querySelectorAll(this.targetArea.identifier() + " script")[i].src){
      renderedInternalScripts.push(document.querySelectorAll(this.targetArea.identifier() + " script")[i]);
    }else{
      renderedExternalScripts.push(document.querySelectorAll(this.targetArea.identifier() + " script")[i]);
    }
  }

  var allPromises = [];

  // eval() the internal scripts
  renderedInternalScripts.map(function(script){
    allPromises.push(new Promise(function(fulfill, reject){
      var passed = false;
      try{
        eval(script.innerHTML);
        passed = true;
      }
      catch(e){
        throw new Error('Failure to render internal script: ' + e.getMessage);
      }
      if(passed){
        fulfill(console.log('Internal script fulfilled.'));
      }else{
        reject(new Error("Internal script tag failed to render correctly."));
      }
    }));
  });

  // Dynamically load the external
  renderedExternalScripts.map(function(script){
    allPromises.push(new Promise(function(fulfill, reject){
      if(renderExternalScript(script.src)){
        fulfill(console.log('External script fulfilled.'));
      }else{
        reject(new Error("External script tag failed to render correctly."));
      }
    }));
  });

  Promise.all(allPromises).then(function(){
    console.log('Fulfilled all promises.');
    this.completeProcess();
  }.bind(this), function(){
    throw new Error('Some error occurred while attemping to render scripts.');
  });
}

/**
 * Once the page finishes rendering, wrap up any tasks left
 * @param {void}
 * @return {void}
 */
Jaz.prototype.completeProcess = function(){
  // Fire callback
  this.intermission.done();

  // Reset link event listeners to compensate for newly loaded links
  this.remoteBlockRouting();

  // Reset status
  this.status.inProcess = false;
};

/**
 * Handle user pressing back button if Jaz is active.
 */
window.onpopstate = function(e){
  if(typeof window.Jaz_Reference == 'object' && window.Jaz_Reference){
    if(e.state){
      var target = window.location.href || document.URL;
      Jaz_Reference.reconfigureRouting(e, target);
    }
  }
};

/**
 * Takes in a url for an external javascript file and rerenders
 * it onto the current page.
 * @param {url} string, the url of the external script
 * return {void}
 */
function renderExternalScript(url){
  var passed = false;
  try{
    var newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.src = url;
    document.querySelector("head").appendChild(newScript);
    passed = true;
  }
  catch(e){
    throw new Error("External JavaScript file failed to load properly.");
  }
  return passed;
}


// Push Jaz onto the global scope
window.Jaz = Jaz;
