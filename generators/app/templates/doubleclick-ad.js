const Ad = {};
Ad.config = function(config) {
  Ad.loop = 0;
  Ad.loopsMax = 0;
  Ad._initials = document.body.querySelectorAll('.in');
  Ad._ad = document.querySelector('#ad');
  Ad._content = document.querySelector('#content');
  Ad._loop = document.querySelector('#loop');
  for (let data in config) {
    if (Object.prototype.hasOwnProperty.call(config, data)) {
      Ad[data] = config[data];
    }
  }
};
Ad.init = function(config) {
  Ad.config(config);
  let bgs = document.body.querySelectorAll('.bg');
  for (let i = 0; i < bgs.length; i ++) {
    Ad['_bg' + bgs[i].id.replace('bg', '')] = bgs[i];
    bgs[i].style.backgroundImage = 'url(images/bg' + bgs[i].id.replace('bg', '') + '.jpg)';
  }
  document.querySelector('#loop').style.backgroundImage = document.querySelector('#bg1').style.backgroundImage;
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
  const fx = [
    'in', 'fadeIn', 'fadeOut', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'fadeInShortUp',
    'fadeInShortDown', 'fadeInShortLeft', 'fadeInShortRight', 'fadeInLongUp', 'fadeInLongDown', 'fadeInLongLeft',
    'fadeInLongRight', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'slideInCenter',
  ];
  for (let i = 0; i < fx.length; i ++) {
    classie.remove(obj, fx[i]);
  }
};
Ad.events = function() {};
Ad.animation = function() {};
Ad.clickthrough = function(obj, tag) {
  addEvent(obj, 'click', function() {
    console.log(tag);
    Enabler.exit(tag);
  });
};
