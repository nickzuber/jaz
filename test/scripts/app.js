
require(['Jaz'], function(Jaz){

  var J = new Jaz();

  function loadingFunction(){
    
    var waiting = document.createElement('div');
    waiting.className = 'waiting';
    document.body.appendChild(waiting);
    
    //document.querySelectorAll('.tb-content-panel')[1].style.opacity = 0;
  }

  function loadedFunction(){
    
    document.querySelector('.waiting').remove();
    
    //document.querySelectorAll('.tb-content-panel')[1].style.opacity = 1;
  }

  J.config({
    scope: "*",
    intermission: {
      loading: loadingFunction,
      callback: loadedFunction
    }
  });

  J.invoke();

});