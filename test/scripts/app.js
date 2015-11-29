
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
    if(!document.querySelector('.waiting')){
      var waiting = document.createElement('div');
      waiting.className = 'waiting';
      document.body.appendChild(waiting);
      document.querySelector('#nav-header').innerHTML = '<img src="img/loading.gif" style="opacity:.25;" height="50px" />';
      updateColor();
    }
  }

  function loadedFunction(){
    if(document.querySelector('.waiting')){
      document.querySelector('.waiting').remove();
      document.querySelector('#nav-header').innerHTML = 'Home';
      addHandlers();
    }
  }

  J.config({
    scope: "*",
    intermission: {
      loading: loadingFunction,
      callback: loadedFunction
    },
    delay: 500,
    targetArea: ".action-panel-main"
  });

  J.listen();

  /*
    NOTES
    
     - update the page <title></title>
     - (maybe) have a flag set to decide if dev wants to refresh <head></head>
    
    
  */

});