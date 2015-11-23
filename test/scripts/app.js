
require(['Jaz'], function(Jaz){

  var J = new Jaz();

  function loadingFunction(){
    if(!document.querySelector('.waiting')){
      var waiting = document.createElement('div');
      waiting.className = 'waiting';
      document.body.appendChild(waiting);
    }
  }

  function loadedFunction(){
    if(document.querySelector('.waiting')){
      document.querySelector('.waiting').remove();
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

});