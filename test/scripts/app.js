
require(['Jaz'], function(Jaz){

  var J = new Jaz();

  function loadingFunction(){
    if(!document.querySelector('.waiting')){
      var waiting = document.createElement('div');
      waiting.className = 'waiting';
      document.body.appendChild(waiting);
      document.querySelector('#nav-header').innerHTML = '<img src="img/loading.gif" style="opacity:.25;" height="35px" />';
    }
  }

  function loadedFunction(){
    if(document.querySelector('.waiting')){
      document.querySelector('.waiting').remove();
      document.querySelector('#nav-header').innerHTML = 'Home';
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