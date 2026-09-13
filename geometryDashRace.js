//jshint esnext:true
///cs/pro/5733417664643072

const bDeviation = [-2, 2];
const wDeviation = [-0.2, 0.2];

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
  players: [],
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
        (playerObj.x < x - b / 5 + (b / 2.5)) &&
        (simulation.y + 30 > y - h / 1.8) &&
        (playerObj.y < y)
    );
},
  allSpikeCollisions: function () {
    for(let k = simulation.players.length - 1; k >= 0; k--) {
      let dead = false;
      for(let i = 0; i < simulation.spikes.length && !dead; i++) {
          if(simulation.spikeCollision(simulation.players[k], simulation.spikes[i], 300, 25, 25)) {
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
        fill(0, 0, 0);  
        if(fade) {fill(0, 0, 0, 75);}
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
    simulation.allSpikeCollisions();
    for(let i = 0; i < simulation.players.length; i++) {
      let currPlayer = simulation.players[i];
      currPlayer = simulation.doJumps(currPlayer.ai.output());
      simulation.players[i] = simulation.doPhysics(currPlayer);
    }
  },
  drawAllPlayers: function () {
    for(let i = 0; i < simulation.players.length; i++) {
      simulation.draw(simulation.players[i], (simulation.selected === i));
    }
  },
};
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
    simulation.players.push(new Player());
  }
}

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

};
