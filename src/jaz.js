/*! OUT OF DATE  */


/**
 * Status object controls the current state of the program.
 * @attribute {inProcess} current state (true if event is firing)
 */
const Status = {
  inProcess: false
}

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
    return;
  }
  if(typeof functionsObject != 'object'){
    throw new Error("Intermission objects must be constructed with an basic object containing the loading function and a callback function.");
  }

  // Assume we have an object containing two attributes defined as functions
  // labelled 'loading' and 'callback'
  const loading = functionsObject.loading;
  const callback = functionsObject.callback;
  if(typeof callback =='undefined' || typeof loading == 'undefined'){
    throw new Error("Error when defining intermission and callback.");
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
  this.targetArea = undefined;
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
    const targetArea = config.targetArea;
  }
  catch(e){
    throw new Error("Configuration object must be constructed with a string, and an object of functions: " + e.message);
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
 */
Jaz.prototype.reconfigureRouting = function(e, target){
  e.preventDefault();

  // If Jaz is already routing, ignore other requests
  if(this.status.inProcess){
    return;
  }

  // Update status
  this.status.inProcess = true;

  // Fire intermission function
  this.intermission.fire();

  // href string value
  var request;

  console.log('Route path: ' + target);

  if(window.XMLHttpRequest){
    request = new XMLHttpRequest();
    console.log('Request created.');
  }else{
    request = new ActiveXObject("Microsoft.XMLHTTP");
    console.log('Request created.');
  }

  // Open page
  request.open("GET", target, true);

  request.onreadystatechange = function(){
    if(request.readyState == XMLHttpRequest.DONE){
      if(request.status == 200){
        console.log('Request success.');
        
        // Parse loaded HTML and repopulate targetArea
        this.parseHTML(request.responseText);

        // Update current page state (@via history API)
        window.history.pushState({}, '', target);

        // Fire callback
        this.intermission.done();

        // Reset link event listeners to compensate for newly loaded links
        this.remoteBlockRouting();

        // Reset status
        this.status.inProcess = false;
      }
      else{
        throw new Error("AJAX load failed: invalid status returned: " + request.status);
      }
    }
  }.bind(this);

  request.send();

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
}

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


// Push Jaz onto the global scope
window.Jaz = Jaz;
