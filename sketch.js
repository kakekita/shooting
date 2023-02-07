var jet_img;
var jet_size = [80,80]//x,y
var pPos = [0,0];
var sp = 0;
var pRange = [jet_size[0]/4,0,jet_size[0]/2,jet_size[1]]
var bullets = []
var bullet_img;
var bullet_size= [12,12];
var bullet_speed = 20
var bullet_active = false
var bullet_cooldown_count = 0
var bom1_img;
var enemies = [];
var enemy1_img;
var enemy1_speed = 4;
var enemies_status = [];
var effects = [];
var effect_cv = document.getElementById("effect_cv");

function preload() {
  jet_img = loadImage('assets/jet.png');
  bullet_img = loadImage('assets/b1.png');
  //bom1_img = loadImage('assets/bom2.gif');
  enemy1_img = loadImage('assets/enemy1.png');
}

function setup() {
  createCanvas(800, 750);
  imageMode(CENTER);
  rectMode(CENTER);
  
  angleMode(DEGREES);
  this.focus();
  settings();
}

async function draw() {
  var runTF = false
  if (keyIsDown(65)) {
    sp--
    pPos[0] -= 10
    runTF = true
  } else if (keyIsDown(68)) {
    sp++
    pPos[0] += 10
    runTF = true
  }
  
  if(keyIsDown(87)) {
    if(pPos[1] > height/2) {
      pPos[1] = pPos[1]-10
    }
  }else if(keyIsDown(83)) {
    if(pPos[1] < height-80) {
      pPos[1] = pPos[1]+10
    }
  }
  
  if(keyIsDown(38)) {
    if(bullet_active) {
      bullet_active = false
      bullets.push([pPos[0],pPos[1]-(pRange[3]/2),1]);
    }
  }else if(keyIsDown(37)) {
    if(bullet_active) {
      bullet_active = false
      bullets.push([pPos[0],pPos[1]-(pRange[3]/2),0]);
    }
  }else if(keyIsDown(39)) {
    if(bullet_active) {
      bullet_active = false
      bullets.push([pPos[0],pPos[1]-(pRange[3]/2),2]);
    }
  }
  
  /*　なめらかシステム
  pPos[0] = pPos[0]+sp
  sp = sp/1.12
  */
  if(pPos[0] < -80) {
    pPos[0] = width
  }
  
  if(pPos[0] > width) {
    pPos[0] = -jet_size[0];
  }
  
  if(!bullet_active) {
    bullet_cooldown_count++;
  }else {
    bullet_cooldown_count = 0;
  }
  if(bullet_cooldown_count > 8) {
    bullet_active = true
    bullet_cooldown_count = 0;
  }
  
  goBullets();
  for(var e in enemies) {
    if(enemies_status[e][2] == 0) {
      if(enemies[e][0] < 0) {
        enemies[e] = move_0(enemies[e]);
        break
      }
      if(enemies[e][2] <= 120&&enemies[e][2] >= 90||enemies_status[e][0] == 1) {
        if(enemies_status[e][1] != 120&&enemies_status[e][1] != -1) {
          enemies_status[e][1] = Math.floor( Math.random() * (120 + 1 - enemies[e][2]) ) + enemies[e][2];
        }
        if(enemies_status[e][1] == 120) {
          enemies_status[e][0] = 1
          enemies_status[e][1] = -1;
        }else if(enemies_status[e][0] == 1){
          if(enemies[e][2] > -270) {
            enemies[e] = move_2(enemies[e]);
          }else {
            enemies_status[e][0] = 2
          }
        }else {
          enemies[e] = move_1(enemies[e]);
        }
      }else {
        if(enemies_status[e][0] == 2) {
          enemies[e] = move_0(enemies[e]);
          if(enemies[e][0] > height+jet_size[1]) {
            enemies.splice( e, 1 );
            enemies_status.splice(e,1);
          }
        }else {
          enemies[e] = move_1(enemies[e]);
        }
      }
    }else if(enemies_status[e][2] == 1) {
      if(enemies[e][0] > width-200&&enemies[e][2] == 180) {
        enemies[e] = move_0(enemies[e]);
        break
      }
      
      if(enemies[e][2] >= -270&&enemies[e][2] <= -240||enemies_status[e][0] == 1) {
        if(enemies_status[e][1] != -270&&enemies_status[e][1] != -1) {
          enemies_status[e][1] = Math.floor( Math.random() * (enemies[e][2] + 1 + 270) ) + -270;
        }
        if(enemies_status[e][1] == -270) {
          enemies_status[e][0] = 1
          enemies_status[e][1] = -1;
        }else if(enemies_status[e][0] == 1){
          if(enemies[e][2] < -270) {
            enemies[e] = move_1(enemies[e]);
          }else {
            enemies_status[e][0] = 2
          }
        }else {
          enemies[e] = move_2(enemies[e]);
        }
      }else {
        if(enemies_status[e][0] == 2) {
          enemies[e] = move_0(enemies[e]);
          if(enemies[e][0] > height+jet_size[1]) {
            enemies.splice( e, 1 );
            enemies_status.splice(e,1);
          }
        }else {
          enemies[e] = move_2(enemies[e]);
        }
      }
    }
  }
  e = 0;
  for(var b in bullets) {
    for(var e in enemies) {
      var hit_tf = hit_check(bullets[b][0]-bullet_size[0]/2,bullets[b][1]-bullet_size[1]/2,bullets[b][0]+bullet_size[0]/2,bullets[b][1]+bullet_size[1]/2,enemies[e][0]-jet_size[0]/2,enemies[e][1]-jet_size[1]/2,enemies[e][0]+jet_size[0]/2,enemies[e][1]+jet_size[1]/2)
      if(hit_tf) {
        bullets.splice( b, 1 );
        effects.push([enemies[e][0],enemies[e][1]]);
        enemies.splice( e, 1 );
        enemies_status.splice( e, 1 );
        console.log("hit!",e);
        break;
      }
    }
  }
  repaint();
  await sleep(0.1);
  if(runTF) {
    runTF = true
  }
}

function move_0(arr) {
  var x1 = arr[0];
  var y1 = arr[1];
  var distance = enemy1_speed;
  var angle = arr[2];
  var x2 = x1 + distance * Math.cos( angle * (Math.PI / 180) );
  var y2 = y1 + distance * Math.sin( angle * (Math.PI / 180) );
  
  arr[0] = x2
  arr[1] = y2
  arr[2] = angle;
  
  return arr;
}

function move_1(arr) {
  var x1 = arr[0];
  var y1 = arr[1];
  var distance = enemy1_speed;
  var angle = arr[2];
  var x2 = x1 + distance * Math.cos( angle * (Math.PI / 180) );
  var y2 = y1 + distance * Math.sin( angle * (Math.PI / 180) );
  
  arr[0] = x2
  arr[1] = y2
  arr[2] = angle+2
  
  return arr;
  
  
}

function move_2(arr) {
  var x1 = arr[0];
  var y1 = arr[1];
  var distance = enemy1_speed;
  var angle = arr[2];
  var x2 = x1 + distance * Math.cos( angle * (Math.PI / 180) );
  var y2 = y1 + distance * Math.sin( angle * (Math.PI / 180) );
  
  arr[0] = x2
  arr[1] = y2
  arr[2] = angle-2
  
  return arr;
  
  
}

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec*1000));
}

function keyPressed() {
  
}

async function keyReleased() {
  if(keyCode === 32) {
    //bullet_active = true
  }
}

function goBullets() {
  var d = [[-1,-1],[0,-1],[1,-1]];
  for(var b in bullets) {
    bullets[b][0] = bullets[b][0]+bullet_speed*d[bullets[b][2]][0];
    bullets[b][1] = bullets[b][1]+bullet_speed*d[bullets[b][2]][1];
    
    if(bullets[b][1] < -bullet_size[1]) {
      bullets.splice( b, 1 );
    }
  }
}
  
function hit_check(x1_s,y1_s,x1_e,y1_e,x2_s,y2_s,x2_e,y2_e) {
  if((x1_s < x2_s&&x2_s < x1_e)&&(y1_s < y2_s&&y2_s < y1_e)) {
    return true
  }else if((x2_s < x1_s&&x1_s < x2_e)&&(y2_s < y1_s&&y1_s < y2_e)) {
    return true
  }else {
    return false
  }
}

function settings() {
  pPos = [width/2,height-jet_size[1]];
  //enemies.push([width,0,180]);
  //enemies_status.push([0,0,1]);
  //enemies.push([0,0,0]);
  //enemies_status.push([0,0,0]);
  setTimeout(summon_enemy,1);
  repaint();
}

async function summon_enemy() {
  while(true) {
    var random = Math.floor( Math.random() * (2 + 1 - 0) ) + 0;
    if(random == 0) {
      enemies.push([0,0,0]);
      enemies_status.push([0,0,0]);
    }else if(random == 1) {
      enemies.push([width,0,180]);
      enemies_status.push([0,0,1]);
    }
    await sleep(1.2);
  }
}

function plusN(i,p,max,min) {
  var a = i+p
  if(a >= max) {
    return a-max;
  }else if(a < min) {
    return a+max;
  }else {
    return a;
  }
}

function repaint() {
  clear();
  background(200)
  image(jet_img,pPos[0],pPos[1],jet_size[0],jet_size[1]);
  noFill();
  rect(pPos[0],pPos[1],pRange[2],pRange[3]);
  for(var b of bullets) {
    image(bullet_img,b[0]-bullet_size[0]/2,b[1]-bullet_size[1]/2,bullet_size[0],bullet_size[1]);
  }
  //image(bom_img,100,100,128,128);
  
  for(var ef of effects) {
    /*var tmp = document.createElement('img');
    tmp.src = "assets/bom2.gif?"+String(new Date().getTime());
    //tmp.src = "assets/b1.png";
    tmp.style.position = "absolute";
    tmp.width = "128";
    tmp.height = "128";
    tmp.style.left = parseInt(ef[0]-64)+"px"
    tmp.style.top = parseInt(ef[1]-64)+"px"
    effect_cv.appendChild(tmp);*/
    effect_cv.insertAdjacentHTML('beforeend', '<img src="assets/bom2.gif?'+String(new Date().getTime())+'" width="128" height="128" style="position: absolute; left: '+parseInt(ef[0]-64)+'px; top: '+parseInt(ef[1]-64)+'px;">');
    effects.shift();
  }
  for(var e of enemies) {
    //console.log(plusN(e[2],90,360,0));
    //console.log(e);
    //global_rotate = plusN(e[2],90,360,0)
    push()
    translate(e[0],e[1]);
    rotate(plusN(e[2],90,360,0));
    //console.log(plusN(e[2],90,360,0));
    image(enemy1_img,0,0,jet_size[0],jet_size[1]);
    pop()
  }
}
