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
          
          parseHTML(request.responseText);

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
  Jaz.prototype.invoke = function(){
    console.warn('Jaz is ready');
    this.remoteBlockRouting();
  }


  /**
   * Create virtual DOM, load in raw HTML, parsed to extract 
   * target area data and return that data.
   * @param {rawHTML} string, HTML in the form of a string
   * @return target area data
   */
  function parseHTML(rawHTML){
    const DOM = document.createElement('html');
    DOM.innerHTML = rawHTML;

    // Extract targetArea
    const newContent = DOM.querySelectorAll('.tb-content-panel')[1];

    document.querySelectorAll('.tb-content-panel')[1].innerHTML = newContent.innerHTML;
  }


  // Place Jaz onto the global scope
  window.Jaz = Jaz;

  // return module - will remove in production
  return Jaz;

});