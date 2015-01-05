var nodeNumSlider;

var pChoice0;
var pChoice1;
var pChoice2;
var pChoice3;
var pChoice4;
var pChoice5;

var nodes = [];
var potential = 1;
var nodeNum = 9;
var initialAction = 0;
var initialU = 0;
var initialK = 0;
var scaleFactor;
var most;

function setup() {
  createCanvas(800, 400);
 
  /*pChoice0 = createButton('free particle', 0);
  pChoice1 = createButton('linear gradient upward', 1);
  pChoice2 = createButton('linear gradient leftward', 2);
  pChoice3 = createButton('energy step', 3);
  pChoice4 = createButton('inverse well', 4);
  pChoice5 = createButton('simple harmonic', 5);

  pChoice0.mousePressed(function() {potential = 0;});
  pChoice1.mousePressed(function() {potential = 1;});
  pChoice2.mousePressed(function() {potential = 2;});
  pChoice3.mousePressed(function() {potential = 3;});
  pChoice4.mousePressed(function() {potential = 4;});
  pChoice5.mousePressed(function() {potential = 5;});

  pChoice0.position(810, 10);
  pChoice1.position(810, 35);
  pChoice2.position(810, 60);
  pChoice3.position(810, 85);
  pChoice4.position(810, 110);
  pChoice5.position(810, 135);
  */
  nodeNumSlider = createSlider(3,17,11);
  nodeNumSlider.position(10,450);
  nodeNumSlider.size(300);  

  stroke(100);
  noStroke();
  for (var i = 0; i<nodeNumSlider.value(); i++) {
    nodes.push(new Node(map(i, 0, nodeNumSlider.value()-1, 30, width-80), height/2));
  }
}

function draw() {
  background(255);
  strokeWeight(2);
  grid(true);
 // myFunction();

  if (potential == 3) {
    strokeWeight(2);
    stroke(0, 250, 0);
    line(0, width/2+height/2, width/2+height/2, 0);
  }

  if (potential == 4) {
    fill(0, 255, 0);
    ellipse(width/2, height/2, 12, 12);
  }

  if (potential == 5) {
    strokeWeight(2);
    stroke(120);  
    for (var i = 0; i<height; i=i+10) {
      line(width/2, i, width/2, i+5);
    }
  }

  if (keyIsPressed===true) {
    optimizer();
  }

  nodeNumSlider.mouseReleased(numCheck);
  
  for (var i = 0; i<nodes.length; i++) {
    nodes[i].clickedOn();
    nodes[i].display();
    if (i>0) {
        stroke(0);
        strokeWeight(2);
        line(nodes[i].x, nodes[i].y, nodes[i-1].x, nodes[i-1].y);
    }
  }
}

function grid(y) {
  if (y == true) {
    strokeWeight(0.5);
    stroke(150);
    for (var i = 1; i<9*2; i++) {
      line(width, .5*i*height/9, 0, .5*i*height/9);
    }
    for (var i = 1; i<9*4; i++) {
      line(.5*i*height/9, 0, .5*i*height/9, height);
    }
  }
}

function Node(ix, iy) {
  this.x = ix;
  this.y = iy;
  this.selected = false;

  this.display = function() {
    noStroke();
    if (this.selected == false) {
      fill(0);
    }
    else {
      fill(255, 0, 0);
    }
    ellipse(this.x, this.y, 8, 8);
  }

 this.clickedOn = function() {
    if (this.selected == true) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
}

function calculateK() {
  var K = 0;
  for (var i=0; i<nodes.length; i++) {  
    if (i>0) {
      K = K + sq(dist(nodes[i].x, nodes[i].y, nodes[i-1].x, nodes[i-1].y));
    }
  }
  return K;
}

function calculateU() {
  U = 0;
  for (var i=0; i<nodes.length; i++) {  
    U = U + getPE(nodes[i]);
  }
  return U;
}


function getPE(q) {
  switch(potential) {
  case 1:
    return -(3000/(nodeNum*nodeNum)*(q.y) -3800000/(nodeNum*nodeNum)  );
  case 2:
    return -(3000/(nodeNum*nodeNum)*(q.x) - 1900000/(nodeNum*nodeNum) );
  case 3:
    if (q.x + q.y > width/2 + height/2 ) {
      return -(30000);
    }
    else {
      return 0;
    }
  case 4:
    return -(300000)*(1/(dist(q.x, q.y, width/2, height/2)));
  case 5:
    return (10.0/(nodeNum*nodeNum))*(sq(q.x-width/2));
  default:
  return 0;
  }
}

function numCheck(){
if (nodeNum != nodeNumSlider.value()){
 nodes.length = 0;
    nodeNum = nodeNumSlider.value();
   for (var i = 0; i<nodeNum; i++) {
    nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
  }
   initialU = calculateU();
   initialK = calculateK();
   initialAction = calculateK() - calculateU();  
   most = max(initialAction, initialU, abs(initialK)); 
  }
}

function mouseClicked() {
  if (mouseButton == LEFT) {
    for (var i = 0; i < nodes.length; i++) {
      var p = nodes[i];
      if (dist(mouseX, mouseY, p.x, p.y) < 5) {
        nodes[i].selected =  !nodes[i].selected;
        for (var j = 0; j < nodes.length; j++) {
          if (j != i) {
            nodes[j].selected = false;
          }
        }
      }
    }
  }

  if (mouseButton == RIGHT) {
    nodes.length = 0;
    nodeNum = nodeNumSlider.value();
   for (var i = 0; i<nodeNum; i++) {
    nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
  }
   initialU = calculateU();
   initialK = calculateK();
   initialAction = calculateK() - calculateU();  
   most = max(initialAction, initialU, abs(initialK));  
  }
}

function optimizer() {
  var jump = 1;
  if (potential ==3){
    jump = 20;
  }
  for (var j = 0; j<250; j++) {
    for (var i = 1;  i<nodeNumSlider.value()-1; i++) {
      var oldAction = calculateK() - calculateU();
      var tempX = nodes[i].x;
      var tempY = nodes[i].y;
      nodes[i].x = nodes[i].x + randomGaussian()*jump;
      nodes[i].y = nodes[i].y + randomGaussian()*jump;
      if ( calculateK() - calculateU() > oldAction) {
        nodes[i].x  = tempX;
        nodes[i].y = tempY;
      }
    }
  }  
}


function myFunction() {
    potential = document.getElementById("menu1").value;
    return false;
  }
