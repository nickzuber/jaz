
require(['Jaz'], function(Jaz){

  var J = new Jaz();

  function loadingFunction(){
    console.log('loading...');
  }

  function loadedFunction(){
    console.log('done');
  }

  J.config({
    scope: "a",
    intermission: {
      loading: loadingFunction,
      callback: loadedFunction
    }
  });

  J.invoke();

});