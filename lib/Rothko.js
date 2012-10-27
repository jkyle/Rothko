/*!
 * Rothko v0.1
 *
 * Copyright (c) 2012 J. Kyle Fagan
 * Available under the BSD, MIT, and WTFPL licenses.
 *
 * Rothko provides a set of utilities for performant interaction
 * with the Canvas element. Or, it will.
 */

define(['components/underscore/underscore.js'], function(_){

  var Rothko, Layer, Drawable;

  if (!window.requestAnimFrame){
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  }
    
/*
  var canvas = document.getElementById("game");

  var world = Rothko.create(
  {
    element: canvas,
    container: document.getElementById("gameContainer"),
    ctx: canvas.getContext('2d'),
    width: canvas.width,
    height: canvas.height,
    layerOrder: [],
    layers: [],
    scale: 1
  });
*/

  Rothko = function(stackId, options){
    this.element = document.getElementById(stackId);
    this.options = options ? options : {};
    this.width = options.width ? options.width : 500;
    this.height = options.height ? options.height : 500;
    this.fps = options.fps ? options.fps : 60;
    this.origin = { x: 0, y: 0 };
    this.layers = {};
    this.layerOrder = [];
  };

  Rothko.prototype.newLayer = function(layerName, layerIndex) {
    var newLayer = new Layer(layerName, this);
    if (!this.layers[layerName]) {
      this.layers[layerName] = newLayer;
    }
    
    if (layerIndex && this.layerOrder.length >= layerIndex) {
      this.layerOrder.splice(layerIndex, 0, newLayer);
    } else {
      this.layerOrder.push(newLayer);
    }

    return newLayer;
  };

  Rothko.prototype.newSprite = function(drawMethod){
    var sprite = new Sprite(drawMethod);
  };

  Rothko.prototype.spawn = Rothko.prototype.newSprite;

  Rothko.prototype.run = function(time) {
     // var deltaTime = time - this.lastUpdate;
     // this.update(deltaTime);
      this.render();
     //this.lastUpdate = time;
      requestAnimFrame(this.run);
    };

  Rothko.prototype.translate = function(x, y) {
      this.origin.x += x;
      this.origin.y += y;
    };
    
  Rothko.prototype.clear = function() {
      //this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillRect(0, 0, this.width, this.height);
    };

  Rothko.prototype.update = function(tDelta) {
    this.each(this.sets, function(set, i)
      {
        this.each(set,
          function(obj, i)
          {
            obj.update(tDelta);
          }
        );
      }
    );
  };

  Rothko.prototype.render = function(tDelta) {
    for(var i = 0; i < this.layers.length; i++)
    {
      if(this.layers[i].needsRender)
      {
        this.layers[i].render();
      }
    }
  };

  Rothko.prototype.subscribe = function(layer, eventType) {
    if(this.events[eventType])
    {
      this.events[eventType].push(layer);
    } else
      {
        this.events[eventType] = [layer];
      }
  };

  Rothko.prototype.handleEvent = function(event) {
    if(this.events[event.type])
    {
      for(var i = this.events[event.type].length - 1; i > -1; i-=1)
      {
        this.events[event.type][i].handleEvent(event);
      }
    }
  };

  // Each layer will have its own canvas element.

  Layer = function(layerName, stack){
    this.name = layerName;
    this.sprites = [];
    this.needsRender = false;
    var canvas = document.createElement('canvas');
    this.element = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = stack.width;
    canvas.height = stack.height;
    stack.element.appendChild(canvas);
  };
  
  Layer.prototype.toString = function LayerToString(){
    return this.name;
  };

  Layer.prototype.clear = function()
  {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  Layer.prototype.render = function()
  {
    this.clear();
    
    for(var i = 0; i < this.sprites.length; i++)
    {
      var obj = this.sprites[i];
    
      if( obj.position.x + obj.width/2 > 0 &&
          obj.position.x - obj.width/2 < this.width &&
          obj.position.y + obj.height/2 > 0 &&
          obj.position.y - obj.height/2 < this.height )
               {
                  obj.draw();
               }
    }
    this.needsRender = false;
  };

  Layer.prototype.add = function(sprite) {
    this.sprites.push(sprite);
    sprite.layer = this;
    sprite.ctx = this.ctx;
  };

Sprite = function(drawMethod) {
  this.draw = drawMethod;
};

Sprite.prototype.render = function() {
    this.ctx.save();
    this.ctx.scale(this.world.scale, this.world.scale);
    this.ctx.translate(this.position.x+ this.world.o.x, this.position.y + this.world.o.y);
    this.draw();
    this.ctx.restore();
  };

// /*-------------------------------------------------------------------------*/
// I'm going to assume for a while that this will just be AMD compatible by default for a while.

return Rothko;

// if(typeof module !== 'undefined' && module.exports)
// {
//   module.exports = Rothko;
// } else{
//   root['Rothko'] = Rothko;
//   root['Rothko']['Layer'] = Layer;
// }

// /*--------------------------------------------------------------------------*/

//   // Did I steal this pattern from Lo Dash? Yes.
//   // Did I probably screw it up? Yes.

//   // expose Rothko
//   // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
//   if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {

//     define(function() {
//       return Rothko;
//     });
//   }
//   // check for `exports` after `define` in case a build optimizer adds an `exports` object
//   else if (typeof exports == 'object' && exports) {
//     // in Node.js or RingoJS v0.8.0+
//     if (typeof module == 'object' && module && module.exports) {
//       module.exports = Rothko;
//     }
//   }
//   else {
//     window.Rothko = Rothko;
//   }

});