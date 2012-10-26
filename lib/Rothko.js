/*!
 * Rothko v0.1
 *
 * Copyright (c) 2012 J. Kyle Fagan
 * Available under the BSD, MIT, and WTFPL licenses.
 *
 * Rothko provides a set of utilities for performant interaction
 * with the Canvas element. Or, it will.
 */

(function(root, _){
  var Rothko, Layer, Drawable;
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
  
  var stackElement = document.getElementById(stackId);
  this.ctx = canvasEl.getContext('2d');

  this.origin = { x: 0, y: 0 };
  this.events = {};
  this.layers = {};
  this.layerOrder = [];
  this.options = options ? options : {};
};

Rothko.prototype.newLayer = function(layerName, layerOrder) {
  if (!this.layers[layerName]) {
    this.layers[layerName] = new Layer(this);
  }
  
  if (layerOrder) {

  }

  return this.layers[layerName];
};

Rothko.prototype.addToLayer = function(layer, obj, drawMethod) {
    if(this.layers[layer])
    {
      this.layers[layer].push([obj, drawMethod]);
    } else
      {
        this.layers[layer] = [[obj, drawMethod]];
      }
  };

Rothko.prototype.getLayer = function(layer) {
    if(this.layers[layer])
    {
      return this.layers[layer];
    } else
      {
        return null;
      }
  };

Rothko.prototype.addToSet = function(set, obj) {
    if(this.sets[set])
    {
      this.sets[set].push(obj);
    } else
      {
        this.sets[set] = [obj];
      }
  };

Rothko.prototype.getSet = function(set) {
    if(this.sets[set])
    {
      return this.sets[set];
    } else
      {
        return null;
      }
  };

Rothko.prototype.runLoop = function(time) {
    var deltaTime = time - this.lastUpdate;
   // this.update(deltaTime);
    this.render(deltaTime);
    this.lastUpdate = time;
    requestAnimFrame(this.runLoop, this.ctx);
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

Layer = function(stack){
  this.needsRender = false;
  this.width = stack.width;
  this.height = stack.height;
  var canvas = document.createElement('canvas');
  this.element = canvas;
  this.ctx = canvas.getContext('2d');
  canvas.width = stack.width;
  canvas.height = stack.height;
  stack.container.appendChild(canvas);
};
  
  Layer.prototype.clear = function()
  {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  Layer.prototype.render = function()
  {
    this.clear();
    
    for(var i = 0; i < this.set.length; i++)
    {
      var el = this.set[i],
          obj = el[0],
          drawMethod = el[1];
    
      if( obj.position.x + obj.width/2 > 0 &&
          obj.position.x - obj.width/2 < this.width &&
          obj.position.y + obj.height/2 > 0 &&
          obj.position.y - obj.height/2 < this.height )
               {
                  obj[drawMethod]();
               }
    }
    this.needsRender = false;
  };

  Layer.prototype.addToLayer = function(obj, drawMethod)
  {
    this.set.push([obj, drawMethod]);
    obj.layer = this;
  };

Drawable = function(){};

Drawable.prototype.draw = function() {
    this.ctx.save();
    this.ctx.scale(this.world.scale, this.world.scale);
    this.ctx.translate(this.position.x+ this.world.o.x, this.position.y + this.world.o.y);
    this.innerDraw();
    this.ctx.restore();
  };


if(typeof module !== 'undefined' && module.exports)
{
  module.exports = Rothko;
} else{
  root['Rothko'] = Rothko;
  root['Rothko']['Layer'] = Layer;
}


}(this, _));