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

  // shim layer with setTimeout fallback
  // from Paul Irish
  // root.requestAnimFrame = (function(){
  // return  root.requestAnimationFrame       || 
  //         root.webkitRequestAnimationFrame || 
  //         root.mozRequestAnimationFrame    || 
  //         root.oRequestAnimationFrame      || 
  //         root.msRequestAnimationFrame     || 
  //         function(/* function */ callback, /* DOMElement */ element){
  //           root.setTimeout(callback, 1000 / 60);
  //         };
  // })();

  // var Obj = 
  // {
  //   spawn: function(object){
  //     var newObject = Object.create(this);
  //     for (var prop in object) 
  //     {
  //       if (object.hasOwnProperty(prop)) 
  //       {
  //         newObject[prop] = object[prop];      
  //       }
  //     }
  //     return newObject;
  //   },
  //   each: function(array, callback)
  //   {
  //     for(var i=0, len = array.length; i < len; i++)
  //     {
  //       callback(array[i], i);
  //     }
  //   }
  // };

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
     // console.log(this.name);
      for(var i = 0; i < this.set.length; i++)
      {
        var obj = this.set[i];
        //console.log(obj[0].width);
        if(obj[0].position.x + obj[0].width/2 > 0 && obj[0].position.x - obj[0].width/2 < this.width
                 && obj[0].position.y + obj[0].height/2 > 0
                 && obj[0].position.y - obj[0].height/2 < this.height)
                 {
                    obj[0][obj[1]]();           
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

  var Stack = {
    layers: {},
    layerOrder: [],
    ctx,
    element,
    tileset,
    lastUpdate,
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
    gameLoop: function(time)
    {
      var deltaTime = time - this.lastUpdate;
     // this.update(deltaTime);
      this.render(deltaTime);
      this.lastUpdate = time;
      requestAnimFrame(this.gameLoop, this.ctx);
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
  });

  if(typeof module !== 'undefined' && module.exports)
  {
    module.exports = HexGame;
  } else{
    root['HexGame'] = HexGame;
    root['Layer'] = Layer;
  };

}(this))