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

define(['Status', 'Scope', 'Intermission', 'Target'], function(Status, Scope, Intermission, Target){

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

  /**
   * Continuing the process of creating an http request to fetch
   * the target page and parse its data.
   * @param {e} object, reference to the link that is clicked
   * @param {target} string, the address of our target destination
   */
  Jaz.prototype.continueProcess = function(e, target){

    try{
      console.log(e);
    }
    catch(e){
      console.log('Could not resolve link.');
    }

    // Update current page state
    window.history.pushState({}, '', target);

    // http request object
    var http_request;

    console.log('Route path: ' + target);

    if(window.XMLHttpRequest){
      http_request = new XMLHttpRequest();
    }else{
      http_request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // Open request
    http_request.open("GET", target, true);

    http_request.onreadystatechange = function(){
      if(http_request.readyState == XMLHttpRequest.DONE){
        if(http_request.status == 200){
          
          // Parse loaded HTML and repopulate targetArea
          // Rerender HTML and finish processes
          this.parseHTML(http_request.responseText);
        }
        else{
          // Fall back to default routing
          window.location = target;
          throw new Error("AJAX load failed: invalid status returned: " + http_request.status);
        }
      }
    }.bind(this);

    // Attempt to invoke request
    try{
      http_request.send();
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

    // Update the page title
    document.querySelector('title').innerHTML = DOM.querySelector('title').innerHTML;

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
          throw new Error('Failure to render internal script: ' + e.message);
        }
        if(passed){
          fulfill();
        }else{
          reject(new Error("Internal script tag failed to render correctly."));
        }
      }));
    });

    // Dynamically load the external
    renderedExternalScripts.map(function(script){
      allPromises.push(new Promise(function(fulfill, reject){
        if(renderExternalScript(script.src)){
          fulfill();
        }else{
          reject(new Error("External script tag failed to render correctly."));
        }
      }));
    });

    Promise.all(allPromises).then(function(){
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

  // return module - will remove in production
  return Jaz;

});