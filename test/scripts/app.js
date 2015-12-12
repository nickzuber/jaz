
// Comment out the require bit if using minified file instead of RequiresJS
require(['Jaz'], function(Jaz){

  var J = new Jaz();

  var links = [];

  window.headerColor = 'red';

  function addHandlers(){
    for(var i=0; i<document.querySelectorAll('a').length; i++){
      links.push(document.querySelectorAll('a')[i]);
    }

    links.map(function(a){
      a.addEventListener("mousedown", function(e){
        headerColor = a.getAttribute("data-color");
      });
    });
  }

  function updateColor(){
    document.querySelector('.action-panel-nav').style.backgroundColor = headerColor;
  }

  function loadingFunction(){
    document.querySelector("body").style.opacity = '0';
    //updateColor();
  }

  function loadedFunction(){
    document.querySelector("body").style.opacity = '1';
    //addHandlers();
  }

  J.config({
    scope: "*",
    intermission: {
      loading: loadingFunction,
      callback: loadedFunction
    },
    delay: 500,
    targetArea: "body"
  });

  J.listen();

  /*
    NOTES
    
     - update the page <title></title>
     - (maybe) have a flag set to decide if dev wants to refresh <head></head>
    
    
  */

});