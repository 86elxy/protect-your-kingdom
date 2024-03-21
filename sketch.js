let x = [];
let y = [];
const critterSize = 10;
let up;
let critterXVel = [];
let critterYVel;
let life = 20;
let wallX = [];
let wallY = [];
const wallSize = 15;
let btn1, btn2, btn3,btn4
let title;
let numWall = 20;
let numWave = 0;
let difficulty = 1;
let state = 0; //0-> landing page, 1-> game, 2-> pause screen
let buildwall, downlife, backsound, gameover, killcritter;
let towerX = [];
let towerY = [];
let arrowX = [];
let arrowY = [];
let arrowXVel = 0.8;
let arrowYVel = [];
let yVel = [-1.2, -1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1, 1.2];
let addTower = false;
let pause = false

function preload() {
  soundFormats("wav", "ogg");
  buildwall = loadSound("assets/buildwall");
  downlife = loadSound("assets/downlife");
  backsound = loadSound("assets/backmusic");
  gameover = loadSound("assets/gameover");
  killcritter = loadSound("assets/killcritter");
}

function setup() {
  angleMode(DEGREES)
  //title = createElement('h1','Protect your Kingdom')
  //title.style('color','deeppink')
  createCanvas(600, 400);
  //x = width + critterSize / 2; y = random(0,height)

  btn1 = createButton("start wave");
  btn1.mousePressed(startWave);
  btn1.position(windowWidth / 2 - 30, (windowHeight * 9) / 10);
  btn1.hide();

  btn2 = createButton("start game");
  btn2.mousePressed(startGame);
  btn2.position(windowWidth / 2 - 30, (windowHeight * 9) / 10);

  btn3 = createButton("play again");
  btn3.mousePressed(playAgain);
  btn3.position(windowWidth / 2 - 30, (windowHeight * 9) / 10);
  btn3.hide();
  
  btn4 = createButton('trade 100 wall for 1 life')
  btn4.mousePressed(trade)
  btn4.position(windowWidth / 2 + 100, (windowHeight*9)/10)
  btn4.hide()
  //play background sound
  //backsound.loop();
}

function draw() {
  background("lightgreen");

  //display bonus region
  rectMode(CORNER);
  strokeWeight(0);
  fill("green");
  rect(0, 0, width / 5, height);

  //display "kingdom" text
  push();
  translate(10, height / 2);
  rotate(90);
  textAlign(CENTER);
  textSize(80);
  textFont("courier");
  fill("white");
  text("KINGDOM", 0, 0);
  pop();

  if (state == 0) {
    //landing page
    textAlign(LEFT);
    fill(20);
    textSize(30);
    textFont("Micro 5");
    text("- click to place wall to block critter", width / 4, height / 2 - 30);
    text("- you gain one wall in light green region", width / 4, height / 2);
    text(
      "- you gain 50% more walls in the kingdom",
      width / 4,
      height / 2 + 30
    );
    text(
      "- turrets will appear after wave 5",
      width / 4,
      height / 2 + 30 + 30
    );
  } else if (state == 1) {
    //game

    //display walls
    if (wallX.length != 0) {
      for (let i = 0; i < wallX.length; i++) {
        strokeWeight(0);
        rectMode(CENTER);
        fill("#FFEB3B");
        rect(wallX[i], wallY[i], wallSize / 4, wallSize);
      }
    }

    //display critters
    for (let i = 0; i < x.length; i++) {
      strokeWeight(0);
      fill(50);
      ellipse(x[i], y[i], critterSize, critterSize);
      //move critter
      let temp = round(random(0.8, 1.2) * difficulty, 1);
      if (temp >= 2.5) {
        temp = 2.5;
      }
      critterXVel.push(temp);
      if (random() < 0.4) {
        up = 3.2;
      } else {
        up = -2.2;
      }
      critterYVel = up * noise(x[i]);

      x[i] -= critterXVel[i];
      y[i] += critterYVel;
      //boundary top and bottom
      if (y[i] < 0 + critterSize / 2) {
        y[i] = 0 + critterSize / 2;
      } else if (y[i] > height - critterSize / 2) {
        y[i] = height - critterSize / 2;
      }
      //check for critter crossing line
      if (x[i] + critterSize / 2 < 0) {
        downlife.play();
        x.splice(i, 1);
        y.splice(i, 1);
        critterXVel.splice(i, 1);
        life--;
      }
      //detection collision
      if (wallX.length != 0 && x.length != 0) {
        for (let j = 0; j < wallX.length; j++) {
          if (dist(x[i], y[i], wallX[j], wallY[j]) < 12) {
            killcritter.play();
            x.splice(i, 1);
            y.splice(i, 1);
            critterXVel.splice(i, 1);
            wallX.splice(j, 1);
            wallY.splice(j, 1);
            if (wallX[j] <= width / 5) {
              numWall += 1.5;
            } else {
              numWall++;
            }
          }
        }
      }
    }

    //generate arrow towers
    if (addTower) {
      towerX.push(floor(random(width / 3, (width * 4) / 5)));
      towerY.push(floor(random(30, height - 30)));
      addTower = false;
    }

    //display arrow towers
    for (let i = 0; i < towerX.length; i++) {
      push();
      noFill();
      stroke(120);
      strokeWeight(2);
      arc(towerX[i], towerY[i], critterSize * 2, critterSize * 2, 110, 250);
      pop();
    }

    //generate arrow
    if (towerX.length != 0 && frameCount % (80-numWave) == 0 && arrowX.length < 50) {
      chosen = floor(random(0, towerX.length));
      arrowX.push(towerX[chosen]);
      arrowY.push(towerY[chosen]);
      arrowYVel.push(random(yVel));
      console.log(arrowX);
    }
    //display arrow
    if (arrowX.length != 0) {
      for (let i = 0; i < arrowX.length; i++) {
        push();
        fill("red");
        ellipse(arrowX[i], arrowY[i], critterSize / 2, critterSize / 2);
        pop();

        //update arrow movement
        arrowX[i] -= arrowXVel;
        arrowY[i] += arrowYVel[i];

        //arrow bounce on edge
        if (arrowY[i] <= 0 || arrowY[i] >= height) {
          arrowYVel[i] *= -1;
        }
        //detect arrow collide with wall
        for (let j = 0; j < wallX.length; j++) {
          if (dist(arrowX[i], arrowY[i], wallX[j], wallY[j]) < 7) {
            killcritter.play();
            arrowX.splice(i, 1);
            arrowY.splice(i, 1);
            arrowYVel.splice(i, 1);
            wallX.splice(j, 1);
            wallY.splice(j, 1);
            if (wallX[j] > width / 5) {
              numWall += 1.5;
            } else {
              numWall+=0.5;
            }
          }
        }
        //check for arrow crossing line
        if (arrowX[i] + critterSize / 4 < 0) {
          downlife.play();
          arrowX.splice(i, 1);
          arrowY.splice(i, 1);
          life -= 0.5;
        }
      }
    }

    if(numWave == 30 && x.length == 0){
      btn2.hide()
      btn3.show()
      noLoop()
      textAlign(CENTER);
      textSize(100);
      fill("#E91E63");
      text("You Win !", width / 2, height / 2);
    }
    
    //check for game over
    if (life <= 0) {
      backsound.pause();
      gameover.play();
      btn1.hide();
      btn4.hide()
      btn3.show();
      noLoop();
      textAlign(CENTER);
      textSize(100);
      fill("#E91E63");
      text("Game Over", width / 2, height / 2);
      textSize(60);
      text(
        "You cleared " + str(numWave - 1) + " waves!",
        width / 2,
        height / 2 + 70
      );
    }

    //display life and number of walls
    textSize(30);
    textAlign(RIGHT);
    fill(20);
    textFont("Micro 5");
    text("life: " + str(life), width - 20, 40);
    text("number of walls: " + str(numWall), width - 20, height - 20);
  }
  else if(state == 2){  //pause screen
      textAlign(CENTER);
      textSize(100);
      fill("#E91E63");
      text("Pause", width / 2, height / 2);
    
  }
}

function mousePressed() {
  if (
    numWall > 0.5 &&
    mouseX > 0 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < height &&
    state == 1
  ) {
    wallX.push(mouseX);
    wallY.push(mouseY);
    buildwall.play();
    numWall--;
  }
}

function keyPressed(){
  if(key == ' ' && state == 1){
    state = 2
  }
  else if(key == ' ' && state == 2){
    state = 1
  }
}

function startGame() {
  state = 1;
  btn2.hide();
  btn1.show();
  btn4.show()
}

function startWave() {
  if (x.length <= 120) {
    for (let i = 0; i < floor(20 * difficulty); i++) {
      x.push(width + critterSize / 2);
      y.push(floor(random(0, height)));
    }
    numWave++;
    numWall += 5;
    difficulty += 0.2;
    if (numWave >= 5) {
      addTower = true;
    }
  }
}

function trade(){
  if(numWall >= 100){
    numWall -= 100
    life++
  }
}

function playAgain() {
  
  state = 0;
  life = 20;
  numWall = 20;
  difficulty = 1;
  numWave = 0;
  x = [];
  y = [];
  critterXVel = [];
  wallX = [];
  wallY = [];
  arrowX = []
  arrowY = []
  arrowYVel = []
  towerX = []
  towerY = []
  btn3.hide();
  btn2.show();
  loop();
}
