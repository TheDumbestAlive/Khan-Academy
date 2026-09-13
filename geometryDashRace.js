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
  weightRange: [-10, 10],
  biasRange: [-100, 100],
  gravity: 0.9,
  ground: 270,
  speed: 5,
  jump: 15,
  x: 100,
  playerCount: 20,
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
  addSpikes: function (len) {
    let spikeChance = floor(random(0, 2));
    let consecutiveSpikes = 0;
    for(let i = levelStart; i < len + levelStart; i += 25) {
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
              simulation.players.splice(k, 1);
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
    
  },
  drawAllPlayers: function () {
    for(let i = 0; i < simulation.players.length; i++) {
      simulation.draw(simulation.players[i], 1);
    }
    if(simulation.players.length > 0) {
      simulation.draw(simulation.players[simulation.selected], 0);
    }
  },
};
simulation.addSpikes(5000);
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
    simulation.players.push(new Player(w, b));
  }
}
fillPlayers(simulation.playerCount);
let jumpInput = 0;

let keys = [];

function keyPressed () {
    keys[key.toString()] = true;
    keys[keyCode] = true; 
}
function keyReleased () {
    keys[key.toString()] = false;
    keys[keyCode] = false;
}
/*
function mouseClicked () {
            restartCourse();
}
*/
//let distToNextSpike = spikes[0] - player.x;

frameRate(60);
draw = function() {
  background(21, 0, 107);
  fill(14, 0, 79);
  noStroke();
  rect(0, simulation.ground + 30, width, height - simulation.ground);
  if(simulation.players.length > 0) {
    simulation.x += simulation.speed;
  }
  
  simulation.updateDist();
  simulation.drawAllPlayers();
  simulation.runAllPlayers();
  pushMatrix();
  translate(-simulation.x + 100, 0);
  simulation.drawAllSpikes(1);
  popMatrix();
  
  noStroke();
  pushMatrix();
  translate(-95, 0);
  fill(123, 145, 201);
  rect(150, 0, 275, 100, 20);
  fill(255, 255, 255);
  textSize(15);
  //9999999
  text('Cubes Alive: ' + simulation.players.length, 160, 25);
  text('  Started With: ' + simulation.playerCount, 160, 45);
  text('Current Distance: ' + (simulation.x - 100), 160, 65);
  text('  Best Distance: ' + (simulation.bestDistance), 160, 85);
  text('R to restart' , 325, 20);
  popMatrix();
  //stroke(255, 0, 0);
  //line(200, 0, 200, 400);
};
