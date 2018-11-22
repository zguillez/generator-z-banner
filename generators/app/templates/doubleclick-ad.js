const Ad = {};
Ad.config = function(config) {
  Ad.loop = 0;
  Ad.loopsMax = 0;
  Ad._initials = document.body.querySelectorAll('.in');
  Ad._ad = document.querySelector('#ad');
  Ad._content = document.querySelector('#content');
  Ad._loop = document.querySelector('#loop');
  for (let data in config) {
    Ad[data] = config[data];
  }
};
Ad.init = function(config) {
  Ad.config(config);
  let fondos = document.body.querySelectorAll('.fondo');
  for (let i = 0; i < fondos.length; i ++) {
    Ad['_fondo' + fondos[i].id.replace('fondo', '')] = fondos[i];
    fondos[i].style.backgroundImage = 'url(images/fondo' + fondos[i].id.replace('fondo', '') + '.jpg)';
  }
  document.querySelector('#loop').style.backgroundImage = document.querySelector('#fondo1').style.backgroundImage;
  let textos = document.body.querySelectorAll('.txt');
  for (let i = 0; i < textos.length; i ++) {
    Ad['_txt' + textos[i].id.replace('txt', '')] = textos[i];
    textos[i].style.backgroundImage = 'url(images/txt' + textos[i].id.replace('txt', '') + '.png)';
  }
  let images = document.body.querySelectorAll('.img');
  for (let i = 0; i < images.length; i ++) {
    Ad['_img' + images[i].id.replace('img', '')] = images[i];
    images[i].style.backgroundImage = 'url(images/img' + images[i].id.replace('img', '') + '.png)';
  }
};
Ad.start = function() {
  Ad.events();
  Ad.animation();
};
Ad.transicion = function(time, itemIn, itemOut, aniIn, aniOut, wait) {
  let _wait = wait || 800;
  setTimeout(function() {
    if (itemOut) {
      Ad.clean(itemOut);
      classie.add(itemOut, aniOut);
      setTimeout(function() {
        classie.remove(itemOut, aniOut);
      }, _wait + 200);
      if (itemIn) {
        setTimeout(function() {
          classie.remove(itemIn, aniOut);
          classie.add(itemIn, aniIn);
        }, _wait);
      }
    } else {
      if (itemIn) {
        classie.add(itemIn, aniIn);
      }
    }
  }, time);
};
Ad.doLoop = function(wait) {
  setTimeout(function() {
    if (Ad.loop < Ad.loopsMax || Ad.loopsMax < 0) {
      Ad.transicion(500, Ad._loop, null, 'fadeIn', '');
      setTimeout(function() {
        let items = document.body.querySelectorAll('.animated');
        for (let i = 0; i < items.length; ++ i) {
          (items[i] !== Ad._loop) ? Ad.clean(items[i]) : null;
        }
      }, 1000);
      setTimeout(function() {
        for (let i = 0; i < Ad._initials.length; ++ i) {
          classie.add(Ad._initials[i], 'in');
        }
      }, 1250);
      setTimeout(function() {
        classie.add(Ad._loop, 'fadeOut');
      }, 1500);
      setTimeout(function() {
        Ad.clean(Ad._loop);
      }, 2000);
      setTimeout(function() {
        Ad.loop ++;
        Ad.animation();
      }, 2000);
    }
  }, wait);
};
Ad.clean = function(obj) {
  classie.remove(obj, 'in');
  classie.remove(obj, 'fadeIn');
  classie.remove(obj, 'fadeInUp');
  classie.remove(obj, 'fadeInDown');
  classie.remove(obj, 'fadeInLeft');
  classie.remove(obj, 'fadeInRight');
  classie.remove(obj, 'fadeOut');
  classie.remove(obj, 'slideInCenter');
  classie.remove(obj, 'slideUp');
  classie.remove(obj, 'slideDown');
  classie.remove(obj, 'slideLeft');
  classie.remove(obj, 'slideRight');
};
Ad.events = function() {};
Ad.animation = function() {};
Ad.clickthrough = function(obj, tag) {
  addEvent(obj, 'click', function() {
    console.log(tag);
    Enabler.exit(tag);
  });
};
