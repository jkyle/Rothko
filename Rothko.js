/*!
 * Rothko v0.1
 *
 * Copyright (c) 2012 J. Kyle Fagan
 * Available under the BSD, MIT, and WTFPL licenses.
 *
 * Rothko provides a set of utilities for performant interaction
 * with the Canvas element. Or, it will.
 */

(function(root){

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

  var Rothko = {
    // layers: {},
    // layerOrder: [],
    // ctx,
    // element,
    // tileset,
    // lastUpdate,
    addToLayer: function(layer, obj, drawMethod)
    {
      if(this.layers[layer])
      {
        this.layers[layer].push([obj, drawMethod]);
      } else 
        {
          this.layers[layer] = [[obj, drawMethod]];
        }
    },
    getLayer: function(layer)
    {
      if(this.layers[layer])
      {
        return this.layers[layer];
      } else 
        {
          return null;
        }
    },
    addToSet: function(set, obj)
    {
      if(this.sets[set])
      {
        this.sets[set].push(obj);
      } else
        {
          this.sets[set] = [obj];
        }
    },
    getSet: function(set)
    {
      if(this.sets[set])
      {
        return this.sets[set];
      } else
        {
          return null;
        }
    },
    runLoop: function(time)
    {
      var deltaTime = time - this.lastUpdate;
     // this.update(deltaTime);
      this.render(deltaTime);
      this.lastUpdate = time;
      requestAnimFrame(this.runLoop, this.ctx);
    },
    origin:
    {
      x: 0,
      y: 0
    },
    translate: function(x, y)
    {
      this.origin.x += x;
      this.origin.y += y;
    },
    clear: function()
    {
      //this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.fillRect(0, 0, this.width, this.height);
    },
    update:function(tDelta){
      this.each(this.sets, 
        function(set, i)
        {
          this.each(set,
            function(obj, i)
            {
              obj.update(tDelta);
            }
          );
        }
      );
    },
    render: function(tDelta)
    {
      for(var i = 0; i < this.layers.length; i++)
      {
        if(this.layers[i].needsRender)
        {
          this.layers[i].render();
        }
      }
    },
    events: {},
    subscribe: function(layer, eventType)
    {
      if(this.events[eventType])
      {
        this.events[eventType].push(layer);
      } else
        {
          this.events[eventType] = [layer];
        }
    },
    handleEvent: function(event)
    {
      if(this.events[event.type])
      {
        for(var i = this.events[event.type].length - 1; i > -1; i-=1)
        {
          this.events[event.type][i].handleEvent(event);
        }
      }
    }
  };

  var Layer = {
    //set: [],
    needsRender: false,
    init: function(stack)
    {
      stack.layers.push(this);
      this.width = stack.width;
      this.height = stack.height;
      var canvas = document.createElement('canvas');
      this.element = canvas;
      this.ctx = canvas.getContext('2d');
      canvas.width = stack.width;
      canvas.height = stack.height;
      stack.container.appendChild(canvas);
      return this;
    },
    clear: function()
    {
      this.ctx.clearRect(0, 0, this.width, this.height);
    },
    render: function()
    {
      this.clear();
      
      for(var i = 0; i < this.set.length; i++)
      {
        var el = this.set[i],
            obj = el[0],
            drawMethod = el[1]
      
        if(    obj.position.x + obj.width/2 > 0 
            && obj.position.x - obj.width/2 < this.width
            && obj.position.y + obj.height/2 > 0
            && obj.position.y - obj.height/2 < this.height)
                 {
                    obj[drawMethod]();           
                 }
      }
      this.needsRender = false;
    },
    addToLayer: function(obj, drawMethod)
    {
      this.set.push([obj, drawMethod]);
      obj.layer = this;
    }
  }

  var Drawable = {
    draw: function()
    {
      this.ctx.save();
      this.ctx.scale(this.world.scale, this.world.scale);
      this.ctx.translate(this.position.x+ this.world.o.x, this.position.y + this.world.o.y);
      this.innerDraw();
      this.ctx.restore();
    }
  }
  

  if(typeof module !== 'undefined' && module.exports)
  {
    module.exports = Rothko;
  } else{
    root['Rothko'] = Rothko;
    root['Rothko']['Layer'] = Layer;
  };

}(this))