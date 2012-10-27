require.config({
  paths: {'lib': '/lib'}
});

require(['lib/Rothko'], function(Rothko){
  var stack = new Rothko("testStack");
  stack.newLayer("baseLayer");
  stack.layers[]
});