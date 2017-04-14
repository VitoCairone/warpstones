console.log('running mags.js');

Magnetic = new function() {

  var SCREEN_WIDTH = window.innerWidth;
  var SCREEN_HEIGHT = window.innerHeight;

  var RIGHT_OFFSET_CONST = 38;

  // console.log('SCREEN_WIDTH is ' + SCREEN_WIDTH);
  // console.log('SCREEN_HEIGHT is ' + SCREEN_HEIGHT);
  
  var MAGNETS_AT_START = 8;
  var PARTICLES_PER_MAGNET = 21 - 7;
  var MAGNETIC_FORCE_THRESHOLD = 300;

  var LOW_ORBIT = 4;
  var NORMAL_ORBIT = 7;
  var HIGH_ORBIT = 11;

  var canvas;
  var context;
  var particles = [];
  var magnets = [];

  var nextParticleId = 0;
  var maxMarkedParticles = 0;
  
  var mouseX = (window.innerWidth - SCREEN_WIDTH);
  var mouseY = (window.innerHeight - SCREEN_HEIGHT);
  var mouseIsDown = false;
  var mouseDownTime = 0;
  
  var skinIndex = 0;
  var skins = [
     { glowA: 'rgba(0,200,250,0.3)', glowB: 'rgba(0,200,250,0.0)', particleFill: '#ffffff', fadeFill: 'rgba(22,22,22,.6)', useFade: true },
     { glowA: 'rgba(230,0,0,0.3)', glowB: 'rgba(230,0,0,0.0)', particleFill: '#ffffff', fadeFill: 'rgba(22,22,22,.6)', useFade: true },
     { glowA: 'rgba(0,230,0,0.3)', glowB: 'rgba(0,230,0,0.0)', particleFill: 'rgba(0,230,0,0.7)', fadeFill: 'rgba(22,22,22,.6)', useFade: true },
     { glowA: 'rgba(0,0,0,0.3)', glowB: 'rgba(0,0,0,0.0)', particleFill: '#333333', fadeFill: 'rgba(255,255,255,.6)', useFade: true },
     { glowA: 'rgba(0,0,0,0.0)', glowB: 'rgba(0,0,0,0.0)', particleFill: '#333333', fadeFill: 'rgba(255,255,255,.2)', useFade: true },
     { glowA: 'rgba(230,230,230,0)', glowB: 'rgba(230,230,230,0.0)', particleFill: '#ffffff', fadeFill: '', useFade: false }
  ];
  
  this.init = function() {
    
    canvas = document.getElementById( 'world' );
    
    if (canvas && canvas.getContext) {
      context = canvas.getContext('2d');
      
      // Register event listeners
      // window.addEventListener('mousemove', documentMouseMoveHandler, false);
      // window.addEventListener('mousedown', documentMouseDownHandler, false);
      // window.addEventListener('mouseup', documentMouseUpHandler, false);
      // document.getElementById( 'prevSkin' ).addEventListener('click', previousSkinClickHandler, false);
      // document.getElementById( 'nextSkin' ).addEventListener('click', nextSkinClickHandler, false);
      //window.addEventListener('resize', windowResizeHandler, false);
      
      createMagnets();
      
      window.addEventListener('resize', windowResizeHandler, false);
      windowResizeHandler();
      
      requestAnimationFrame( loop );
    }
  }

  this.contractParticles = function (magnetIdx) {
    magnets[magnetIdx].orbit = LOW_ORBIT;
  }

  this.expandParticles = function (magnetIdx) {
    magnets[magnetIdx].orbit = NORMAL_ORBIT;
  }

  this.hiliteMagnetParticle = function (magnetIdx) {
    var magnet = magnets[magnetIdx];
    var particleIdx = magnet.markedParticles;
    if (magnet.markedParticles == magnet.particles.length) {
      return;
    }
    magnet.markedParticles += 1;
    magnet.particles[particleIdx].betGlowFrames = 30;
    magnet.particles[particleIdx].innerColorStop = 'rgba(256,0,0,1.0)';
    if (magnet.markedParticles > maxMarkedParticles) {
      maxMarkedParticles = magnet.markedParticles;
    }
  }

  this.unhiliteAllParticles = function () {
    for (var i = 0; i < magnets.length; i++) {
      magnets[i].markedParticles = 0;
    }
    for (var i = 0; i < particles.length; i++) {
      particles[i].innerColorStop = 'rgba(256,256,256,1.0)';
    }
    maxMarkedParticles = 0;
  }

  this.resetMaxMarked = function () {
    maxMarkedParticles = 0;
  }

  this.transferMarkedParticles = function (from, to) {
    var magnet = magnets[from];
    var magnetTo = magnets[to];
    for (var i = 0; i < magnet.markedParticles; i++) {
      var particle = magnet.particles.shift();
      magnetTo.particles.unshift(particle);
      particle.magnet = magnetTo;
      particle.timeToArrival = Math.round(30 + Math.random() * 30);
    }
    magnet.markedParticles = 0;
  }

  this.distributeParticles = function (from, toList, counterSync) {
    if (toList.length < 1) {
      return;
    }

    // console.log('in distribPart');
    // console.log('toList: ' + JSON.stringify(toList));
    var magnet = magnets[from];
    var counter = counterSync;

    // console.log('length is now: ' + magnet.particles.length);
    while (magnet.particles.length > 0) {
      // console.log('running ' + i);
      var particle = magnet.particles.shift();
      var magnetTo = magnets[toList[counter]];
      counter = (counter + 1) % toList.length;
      magnetTo.particles.unshift(particle);
      particle.magnet = magnetTo;
      particle.timeToArrival = Math.round(30 + Math.random() * 30);
    }

    // console.log('length is now: ' + magnet.particles.length);
  }

  this.conjureParticles = function (magnetIdx, count) {
    var magnet = magnets[magnetIdx];
    createParticles(null, magnet, count);
  }

  this.destructParticles = function (magnetIdx, count) {
    var magnet = magnets[magnetIdx];
    var killParticleIds = {};
    
    for (var i = 0; i < count; i++) {
      particle = magnet.particles.pop();
      killParticleIds[particle.id] = true;
    }

    // console.log(killParticleIds);

    var originalParticles = particles.concat([]);
    particles.length = 0;
    for (var i = 0; i < originalParticles.length; i++) {
      //console.log("in " + i + ' of' + originalParticles.length)
      if ( !(originalParticles[i].id in killParticleIds) ) {
        // console.log("pushing");
        particles.push(originalParticles[i]);
      } else {
        // ;console.log("DESTRUCTED");
      }
    }
  }

  function createMagnets() {
    var w = 393;
    var h = 262;
    
    // this will be magnets[0]
    createMagnet({x: w / 2, y: h / 2 + 30});
    magnets[0].orbit = 25;

    for (var i = 0; i < MAGNETS_AT_START; i++) {

      var position = {
        x: 35,
        y: 118 + 37 * (i % 4)
        // x: ( SCREEN_WIDTH - w ) * 0.5 + (Math.random() * w), 
        // y: ( SCREEN_HEIGHT - h ) * 0.5 + (Math.random() * h)
      };

      if (i > 3) {
        position.x = w - 35;
      }
      
      createMagnetAndParticles( position );
    }
  }
  
  function createMagnet( position ) {
    var m = new Magnet();
    m.position.x = position.x;
    m.position.y = position.y;
    
    magnets.push( m );
  }

  function createMagnetAndParticles( position ) {
    var m = new Magnet();
    m.position.x = position.x;
    m.position.y = position.y;
    
    magnets.push( m );
    
    createParticles( m.position, m, PARTICLES_PER_MAGNET );
  }
  

  function createParticles( position, magnet, count ) {
    if (position == null) {
      position = magnet.position;
    }
    for (var i = 0; i < count; i++) {
      var p = new Particle();
      p.id = nextParticleId++;
      p.position.x = position.x;
      p.position.y = position.y;
      p.shift.x = position.x;
      p.shift.y = position.y;
      //p.color = skins[skinIndex].particleFill;
      p.magnet = magnet;
      
      magnet.particles.push( p );
      particles.push( p );
    }


  }

  function loop() {
    
    context.clearRect(0,0,canvas.width,canvas.height);
    
    var particle, magnet;
    var i, j, ilen, jlen;
    
    // Render the magnets
    for( j = 0, jlen = magnets.length; j < jlen; j++ ) {
      magnet = magnets[j];
      
      // Render the particles
      for (i = 0, ilen = magnet.particles.length; i < ilen; i++) {
        particle = magnet.particles[i];
        
        var force = { x: 0, y: 0 };
        
        if (particle.magnet != null) {
          
          // magnet = particle.magnet;

          var fx = magnet.position.x - particle.position.x;
          // if( fx > -MAGNETIC_FORCE_THRESHOLD && fx < MAGNETIC_FORCE_THRESHOLD ) {
            force.x += fx / MAGNETIC_FORCE_THRESHOLD;
          // }
          
          var fy = magnet.position.y - particle.position.y;
          // if( fy > -MAGNETIC_FORCE_THRESHOLD && fy < MAGNETIC_FORCE_THRESHOLD ) {
            force.y += fy / MAGNETIC_FORCE_THRESHOLD;
          // }

        }

        var orbitPush = 1;
        if (j == 0) {
          // who once where high shall now be low
          orbitPush = 1.0 - (particle.force - 2.1) * 2;
        } else if (magnet.orbit > LOW_ORBIT && i < maxMarkedParticles) {
          // render a higher orbit for particles below the max wager
          orbitPush = HIGH_ORBIT / NORMAL_ORBIT;
        }
        
        // Rotation
        particle.angle += particle.speed;

        // Translate towards the magnet position
        // particle.shift.x += (particle.magnet.position.x - particle.shift.x) * particle.speed;
        // particle.shift.y += (particle.magnet.position.y - particle.shift.y) * particle.speed;
        if (particle.timeToArrival >= 1) {
          particle.shift.x += (particle.magnet.position.x - particle.shift.x) * 1/particle.timeToArrival;
          particle.shift.y += (particle.magnet.position.y - particle.shift.y) * 1/particle.timeToArrival;
          particle.timeToArrival -= 1;
        } else {
          particle.shift.x = particle.magnet.position.x;
          particle.shift.y = particle.magnet.position.y;
        }
        
        // Appy the combined position including shift, angle and orbit
        particle.position.x = particle.shift.x + Math.cos(i+particle.angle) * (particle.orbit*particle.force*orbitPush);
        particle.position.y = particle.shift.y + Math.sin(i+particle.angle) * (particle.orbit*particle.force*orbitPush);
        
        // Limit to screen bounds
        particle.position.x = Math.max( Math.min( particle.position.x, SCREEN_WIDTH-particle.size/2 ), particle.size/2 );
        particle.position.y = Math.max( Math.min( particle.position.y, SCREEN_HEIGHT-particle.size/2 ), particle.size/2 );
        
        // Slowly inherit the closest magnets orbit
        particle.orbit += ( particle.magnet.orbit - particle.orbit ) * 0.1;

        if (particle.betGlowFrames != 0) {

          var glowRad = particle.size * 3 + particle.betGlowFrames * 0.1;

          var gradientFill = context.createRadialGradient(particle.position.x,particle.position.y,0,particle.position.x,particle.position.y,glowRad);
          gradientFill.addColorStop(0, particle.innerColorStop);
          gradientFill.addColorStop(1, 'rgba(230,230,0,0.0)');
        
          context.beginPath();
          context.fillStyle = gradientFill;
          context.arc(particle.position.x, particle.position.y, glowRad, 0, Math.PI*2, true);
          context.fill();
        
          context.beginPath();
          context.fillStyle = '#ffffff';
          context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
          context.fill(); 

          if (particle.betGlowFrames > 0) {
            particle.betGlowFrames--;
            if (particle.betGlowFrames == 0) {
              particle.betGlowFrames = -30;
            }
          } else {
            particle.betGlowFrames++;
          }

        } else if (j > 0 && i > magnet.markedParticles && i < maxMarkedParticles) {
          // these are unmatched particles

          var glowRad = particle.size * 2;
          var gradientFill = context.createRadialGradient(particle.position.x,particle.position.y,0,particle.position.x,particle.position.y,glowRad);
          gradientFill.addColorStop(0, particle.innerColorStop);
          gradientFill.addColorStop(1, 'rgba(0,0,256,0.0)');
        
          context.beginPath();
          context.fillStyle = gradientFill;
          context.arc(particle.position.x, particle.position.y, glowRad, 0, Math.PI*2, true);
          context.fill();
        
          context.beginPath();
          context.fillStyle = '#ffffff'; //'#000000';
          context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
          context.fill();

        } else {

          var glowRad = particle.size * 1.5;
          var gradientFill = context.createRadialGradient(particle.position.x,particle.position.y,0,particle.position.x,particle.position.y,glowRad);
          gradientFill.addColorStop(0, particle.innerColorStop);
          gradientFill.addColorStop(1, 'rgba(0,0,256,0.0)');
        
          context.beginPath();
          context.fillStyle = gradientFill;
          context.arc(particle.position.x, particle.position.y, glowRad, 0, Math.PI*2, true);
          context.fill();
        
          context.beginPath();
          context.fillStyle = '#ffffff';
          context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
          context.fill();

        }

      } // end i loop (particles)

      // if (typeof particle.outerColor !== 'undefined') {
      //   context.beginPath();
      //   context.fillStyle = particle.outerColor;
      //   context.arc(particle.position.x, particle.position.y, particle.size/2 + 2, 0, Math.PI*2, true);
      //   context.fill();
      // }

      // context.beginPath();
      // context.fillStyle = particle.color;
      // context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
      // context.fill();
    }

    // need to make sure this doesn't cause memory leaks!
    requestAnimationFrame(loop);
  }
  
  function distanceBetween(p1,p2) {
    var dx = p2.x-p1.x;
    var dy = p2.y-p1.y;
    return Math.sqrt(dx*dx + dy*dy);
  }

  function windowResizeHandler() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    
    canvas.style.position = 'absolute';

    var topFoeMagnet = magnets[5];
    var offsetDelta = (SCREEN_WIDTH - RIGHT_OFFSET_CONST) - topFoeMagnet.position.x;

    magnets[0].position.x = SCREEN_WIDTH / 2;

    for (var i = 5; i < magnets.length; i++) {
      var magnet = magnets[i];
      magnet.position.x += offsetDelta;
      for (var j = 0; j < magnet.particles.length; j++) {
        magnet.particles[j].shift.x += offsetDelta;
      }
    }
    
    // it seems like this will always be '0px'...
    // canvas.style.left = (window.innerWidth - SCREEN_WIDTH) * .5 + 'px';
    // canvas.style.top = (window.innerHeight - SCREEN_HEIGHT) * .5 + 'px';
  }
  
};

function Particle() {
  this.size = 1.5 + Math.random()*3;
  this.position = { x: 0, y: 0 };
  this.shift = { x: 0, y: 0 };
  this.angle = 0;
  this.speed = 0.02 + 0.02 * Math.random() + this.size * 0.004;
  this.force = 2.1 + Math.random() * 0.2; // 1.5 + Math.random() * 1.5;
  this.color = '#ddddff';
  this.innerColorStop = 'rgba(256,256,256,1.0)';
  this.outerColor = '#7777ee';
  this.orbit = 0;
  this.magnet = null;
  this.betGlowFrames = 0;
  this.timeToArrival = 0;
}

function Magnet() {
  this.orbit = 7;
  this.position = { x: 0, y: 0 };
  this.dragging = false;
  this.size = 1;
  this.particles = [];
  this.markedParticles = 0;
}

Magnetic.init();

console.log("finished exec mags.js")
  
  