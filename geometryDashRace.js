//jshint esnext:true
///cs/pro/5733417664643072


const wStart = 10;
const bStart = 100;


const bDeviation = 2;
const wDeviation = 0.2;

const step = function (n) {
  return Number(n >= 0);
};

const PlayerAI = function (w, b) {
  this.weight = w;
  this.bias = b;
  this.output = function (In) {
    return step(In * this.weight + this.bias);
  };
};

const idealAI = new PlayerAI (-1, 100);

const levelStart = 500;

let spikes = [];

//drawSpike(170,300,25,25);


const simulation = {
  doInfGen: false,
  distOffset: 0,
  threshold: 1000,
  overclock: 10,
  doOverclock: false,
  generations: 0,
  len: 50000,
  auto: true,
  weightRange: [-10, 10],
  biasRange: [-100, 100],
  gravity: 0.9,
  ground: 270,
  speed: 5,
  jump: 15,
  x: 100,
  playerCount: 100,
  bestDistance: 0,
  players: [],
  survived: null,
  selected: 0,
  select: function (indx) {
    if(indx >= 0 && indx < simulation.players.length) {
      simulation.selected = indx;
    }
  },
  dead: [],
  spikes: [],
  distToNextSpike: 400,
  addSpikes: function (len, offset) {
    let spikeChance = floor(random(0, 2));
    let consecutiveSpikes = 0;
    for(let i = levelStart + (offset || 0); i < len + levelStart + (offset || 0); i += 25) {
        if(spikeChance === 1 && consecutiveSpikes < 3) {
            simulation.spikes.push(i);
            consecutiveSpikes++;
        }
        else {
            consecutiveSpikes = 0;
            i += 100;
        }
        spikeChance = floor(random(0, 2));
    }
  },
  drawSpike: function (x, y, b, h, hitbox) {
    noStroke();
    fill(0, 198, 247);
    triangle(x, y - h, x + b / 2, y, x - b / 2, y);
    if(hitbox) {
        fill(255, 100, 100, 200);
        rect(x - b / 5, y - h / 1.8, b / 2.5, h / 1.8);
    }
},
  drawAllSpikes: function (showHitboxes) {
    for(let i = 0; i < simulation.spikes.length; i++) {
            simulation.drawSpike(simulation.spikes[i], 300, 25, 25, showHitboxes);
    }
  },
  spikeCollision: function (playerObj, x, y, b, h) {
    return (
        (simulation.x + 30 > x - b / 5) &&
        (simulation.x < x - b / 5 + (b / 2.5)) &&
        (playerObj.y + 30 > y - h / 1.8) &&
        (playerObj.y < y)
    );
},
  allSpikeCollisions: function () {
    for(let k = simulation.players.length - 1; k >= 0; k--) {
      let dead = false;
      for(let i = 0; i < simulation.spikes.length && !dead; i++) {
          if(simulation.spikeCollision(simulation.players[k], simulation.spikes[i], 300, 25, 25)) {
              if(simulation.selected === k) {
                simulation.selected = 0; 
              }
              let deceased = simulation.players.splice(k, 1)[0];
              simulation.dead.push(deceased);
              dead = true;
          }
      }
    }

},
  updateDist: function () {
    for(let i = 0; i < simulation.spikes.length; i++) {
      if(simulation.spikes[i] - simulation.x > 0) {
              simulation.distToNextSpike = simulation.spikes[i] - simulation.x;
              break;
          }
          simulation.distToNextSpike = 400;
      }
  },
  draw: function (playerObj, fade) {
        fill(0, 255, 187);  
        if(fade) {fill(26, 110, 88);}
        pushMatrix();
        translate(115, playerObj.y + 15);
        rotate(playerObj.rotation);
        rect(-15, -15, 30, 30);
        popMatrix();
    },
  doPhysics: function (playerObj) {
        playerObj.yv += simulation.gravity;
        playerObj.y += playerObj.yv;
        if (playerObj.y >= simulation.ground) {
            playerObj.y = simulation.ground;
            playerObj.yv = 0;
            playerObj.touchingGround = true;
            playerObj.rotation = floor(Math.min(playerObj.rotation, 360) / 90) * 90;
        }
        else {
            playerObj.touchingGround = false;
            playerObj.rotation += simulation.speed;
        }
        return playerObj;
    },
  doJumps: function (playerObj, jump) {
        if(jump && playerObj.touchingGround) {
            playerObj.yv -= simulation.jump;
        }
        
        return playerObj;
    },
  runAllPlayers: function () {
    //simulation.allSpikeCollisions();
      simulation.allSpikeCollisions();
      for(let i = 0; i < simulation.players.length; i++) {
        let currPlayer = simulation.players[i];
        currPlayer = simulation.doJumps(currPlayer, currPlayer.ai.output(simulation.distToNextSpike));
        currPlayer = simulation.doPhysics(currPlayer);
        simulation.players[i] = currPlayer;
      }
      if(simulation.players.length === 0) {
        simulation.survived = simulation.dead.at(-1);
      }
    
  },
  displayPlayerInfo: function () {
      if(simulation.players.length === 0) {
          return;
      }
      let plyr = simulation.players[simulation.selected];
      textSize(20);
      fill(255, 255, 255);
      text("Player #"+(simulation.selected + 1) + '/' + simulation.players.length, 10, 330);
      textSize(15);
      text("Weight: " + (Math.trunc(plyr.ai.weight * Math.pow(10, 5)) / (10 * Math.pow(10, 5))), 10, 350);
      text("Bias: " + (Math.trunc(plyr.ai.bias * Math.pow(10, 5)) / (10 * Math.pow(10, 5))), 10, 370);
      noFill();
      stroke(255, 255, 255);
      ellipse(210, 350, 75, 75);
      fill(255, 255, 255);
      textAlign(CENTER, CENTER);
      text("Input: " + simulation.distToNextSpike, 210, 350);
      textSize(30);
      text("->", 270, 350);
      let out = plyr.ai.output(simulation.distToNextSpike);
      
      textSize(20);
      
      if(out) {
          fill(0, 255, 0);
          text("Jump", 320, 350);
      }
      else {
          fill(255, 0, 0);
          text("Don't Jump", 340, 350);
      }
      
      textAlign(CORNER);
  },
  drawAllPlayers: function () {
    for(let i = 0; i < simulation.players.length; i++) {
      simulation.draw(simulation.players[i], 1);
    }
    if(simulation.players.length > 0) {
      simulation.draw(simulation.players[simulation.selected], 0);
    }
  },
  infiniteGeneration: function () {
    if(simulation.x > simulation.spikes.at(-1)) {
        simulation.spikes = [];
        simulation.distOffset += simulation.x;
        simulation.x = 100;
        simulation.addSpikes (simulation.len);
        
    }
  }
};
simulation.addSpikes(simulation.len);
const Player = function (w, b, img) {
  this.ai = new PlayerAI(w, b);
  this.y = simulation.ground;
  this.yv = 0;
  this.touchingGround = true;
  this.rotation = 0;
  this.img = img;
};
function fillPlayers (count) {
  let trueCount = Math.min(1000, count);
  for(let i = 0; i < trueCount; i++) {
    let w;
    let b;
    if(!simulation.survived) {
      w = random(-wStart, wStart);
      b = random(-bStart, bStart);
    }
    else {
      w = simulation.survived.ai.weight + random(-wDeviation, wDeviation);
      b = simulation.survived.ai.bias + random(-bDeviation, bDeviation);
    }
    simulation.players.push(new Player(w, b));
  }
}
function nextGen () {
  simulation.generations++;
  simulation.bestDistance = Math.max((simulation.x + simulation.distOffset) - 100, simulation.bestDistance);
  simulation.distOffset = 0;
  simulation.x = 100;
  
  simulation.spikes = [];
  simulation.addSpikes(simulation.len);
  
  simulation.dead = [];
  
  fillPlayers(simulation.playerCount);
  
}
fillPlayers(simulation.playerCount);
let jumpInput = 0;

let keys = [];

function keyPressed () {
    keys[key.toString()] = true;
    keys[keyCode] = true; 
}
function keyReleased () {
    if((keys.r || keys.R) && (simulation.players.length === 0)) {
      nextGen();
    }
    if((keys.a || keys.A)) {
      simulation.auto = !simulation.auto;
    }
    if((keys.o || keys.O)) {
      simulation.doOverclock = !simulation.doOverclock;
    }
    if((keys.i || keys.I)) {
      simulation.doInfGen = !simulation.doInfGen;
    }
    keys[key.toString()] = false;
    keys[keyCode] = false;
    
}
frameRate(60);
draw = function() {
  background(21, 0, 107);
  fill(14, 0, 79);
  noStroke();
  rect(0, simulation.ground + 30, width, height - simulation.ground);
  if(simulation.doOverclock) {
    for(let i = 0; (i < simulation.overclock); i++) {
      if(simulation.doInfGen) {
        simulation.infiniteGeneration();
      }
      if(simulation.players.length > 0) {
        simulation.x += simulation.speed;
      }
      else if (simulation.auto) {
        nextGen();
      }
    
      simulation.updateDist();
      simulation.drawAllPlayers();
      simulation.runAllPlayers();
      pushMatrix();
      translate(-simulation.x + 100, 0);
      simulation.drawAllSpikes(1);
      popMatrix();
    }
  }
  else {
    if(simulation.players.length > 0) {
      simulation.x += simulation.speed;
    }
    else if (simulation.auto) {
      nextGen();
    }
    
    simulation.updateDist();
    simulation.drawAllPlayers();
    simulation.runAllPlayers();
    pushMatrix();
    translate(-simulation.x + 100, 0);
    simulation.drawAllSpikes(1);
    popMatrix();
  }
  noStroke();
  pushMatrix();
  translate(-95, 0);
  fill(123, 145, 201);
  rect(150, 0, 275, 125, 20);
  fill(255, 255, 255);
  textSize(13);
  //9999999
  text('Cubes Alive: ' + simulation.players.length, 160, 25);
  text('  Started With: ' + simulation.playerCount, 160, 40);
  text('Current Distance: ' + (simulation.x - 100 + simulation.distOffset), 160, 55);
  text('  Best Distance: ' + (simulation.bestDistance), 160, 70);
  text('Current Generation: ' + (simulation.generations), 160, 85);
  
  text('R to restart' , 325, 20);
  text('A to toggle auto' , 325, 35);
  if(simulation.auto) {
    text('  (ON)' , 325, 50);
  }
  else {
    text('  (OFF)' , 325, 50);
  }
  if(!simulation.doOverclock) {
    text('O to toggle \noverclock (OFF)' , 325, 65);
  }
  else {
    text('O to toggle \nspeed (ON)' , 325, 65);
  }
  if(!simulation.doInfGen) {
    text('I to toggle \nendless (OFF)' , 325, 95);
  }
  else {
    text('I to toggle \nendless (ON)' , 325, 95);
  }
  popMatrix();
  //stroke(255, 0, 0);
  //line(200, 0, 200, 400);
  simulation.displayPlayerInfo();
};
