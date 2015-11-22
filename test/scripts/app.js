
require(['Jaz'], function(Jaz){

  var J = new Jaz();

  function loadingFunction(){
    /*
    if(!document.querySelector('.waiting')){
      var waiting = document.createElement('div');
      waiting.className = 'waiting';
      document.body.appendChild(waiting);
    }
    */
    
    document.querySelectorAll('.tb-content-panel')[1].style.opacity = 0;
  }

  function loadedFunction(){
    /*
    if(document.querySelector('.waiting')){
      document.querySelector('.waiting').remove();
    }
    */
    
    document.querySelectorAll('.tb-content-panel')[1].style.opacity = 1;
  }

  J.config({
    scope: "*",
    intermission: {
      loading: loadingFunction,
      callback: loadedFunction
    },
    targetArea: ".action-panel-main"
  });

  J.listen();

});