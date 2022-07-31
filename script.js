'use strict'

const ScreenSize = {
  WIDTH: document.querySelector('body').offsetWidth,
}

let canvas = document.getElementById('canvasMain');
let btn = document.querySelector('.btnMagic');
let body = document.querySelector('body');

var active = true;
var light = true;

var getRandomValue = function(a, b) {
  return a + Math.floor(Math.random() * (b - a))
}

var Theme = function(color, height) {
  this._reset(color, height);
}

Theme.prototype.render = function(ctx) {
  ctx.fillStyle  = this.color;
  ctx.lineWidth = 0;
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  for (let i = 0; i < this.curveX.length; i++) {
    ctx.lineTo(this.curveX[i], this.curveY[i]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

var random = getRandomValue(5, 15)
Theme.prototype.update = function() {
  for (let i = 0; i < this.curveX.length; i++) {
    if (i % 2 == 1) random = getRandomValue(10, 30);
    this.curveX[i] += random;
  }
  let first = true;
  if (this.curveX[this.curveX.length-1] + 250 > ScreenSize.WIDTH && first) {
    var frontground = document.querySelector('.frontground')
    frontground.style['background-color'] = this.color;
    frontground.style['z-index'] = 1;
    if (light) body.classList.add('dark');
    else body.classList.remove('dark');
    first = false;
  }
  if (this.curveX[this.curveX.length-1] + 200 > ScreenSize.WIDTH) {
    active = false
    canvas.style['z-index'] = '-1';
  
    frontground.classList.add('frontground-none');
    setTimeout(function() {
      frontground.style['z-index'] = -1;
      /* frontground.style['opacity'] = 1; */
      var cards = document.querySelectorAll('.cards__card_item'); 
      for (var i = 0; i < cards.length; i++) {
        card_change(i);
      }

      function card_change(index) {
        setTimeout(function() {
          cards[index].classList.toggle('cards__card_item--active');
          console.log(index);
        }, 300 * ((index)));
      };
      
      frontground.classList.remove('frontground-none');
      light = !light;
      first = true;
      active = true;
    }, 500)
  };
}

Theme.prototype._reset = function(color, height) {
  this.height = height;
  this.color = color;

  this.size = 30;
  this.x1 = 0;
  this.y1 = this.height;

  this.x2 = 0;
  this.y2 = 0;

  this.curveX = new Array(1);
  this.curveY = new Array(1);
  this.step = this.height / this.size;


  this.curveX[0] = -20;
  this.curveY[0] = 0;

  for (let i = 1; i < this.size; i++) {
    this.curveX.push(+this.curveX.slice(-1) + getRandomValue(-15, 10));
    this.curveY.push(+this.curveY.slice(-1));

    this.curveX.push(+this.curveX.slice(-1));
    this.curveY.push(+this.curveY.slice(-1) + this.step);
  }

  this.curveX.push(this.curveX[this.curveX.length - 2]);
  this.curveY.push(this.height);
}

var renderFrame = function(ctx, theme) {
  theme.render(ctx);
  theme.update(ctx);

  if (active) requestAnimationFrame(renderFrame.bind(null, ctx, theme));
}

var setup = function() {

  var ctx = canvas.getContext('2d');

  btn.addEventListener('click', function() {
    canvas.style['z-index'] = '1';
    ctx.clearRect(0,0, ScreenSize.WIDTH, canvas.offsetHeight);
    let theme;
    
    if (light) {
      theme = new Theme('#0e171a', canvas.offsetHeight);
      console.log('click light');
    }
    else {
      theme = new Theme('#FEFFFF', canvas.offsetHeight);
      console.log('click dark');
    }
    renderFrame(ctx, theme);
  });
}

setup();