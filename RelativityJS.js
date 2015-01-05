var redtrains = []; 
var bluetrains = [];
var trainLength = 14;

var leftRed, leftRedSerial, leftRedClock, rightRedSerial, rightRedClock ,leftBlueSerial, leftBlueClock, rightBlueSerial, rightBlueClock;

var m, n, leftPhoto, rightPhoto; //Meteors
var leftYes = false; //is there a meteor in the left photo?
var rightYes = false;

var timer = 0;
var counter = 0;  //counts photos taken
var metcounter = 0; //counts pairs of meteors made

function setup() {
    createCanvas(1000, 400);
    textFont("Courier"); 
    textAlign(LEFT);
    textSize(16);
    strokeWeight(0.1);

  // Train(color c_, float xpos_, float ypos_, float xspeed_, int serial_, float offset_, int direction_) 

    for (var i = 0; i < trainLength; i++ ) {
        redtrains.push(new Train(color(250, 120, 120), width/2 - 4 - 70*i, 60, -1, i+1, i*.02, -1));
    }
    for (var i = 0; i < trainLength; i++ ) {
        bluetrains.push(new Train(color(120, 120, 250), width/2 + 4 + 70*i, 100, 1, i+1, i*.02, 1));
    }
}

function draw() {
    background(255);
    fill(0);

    for (var i = 0; i < trainLength; i++ ) { 
        redtrains[i].display();
        bluetrains[i].display();
    }


    if (metcounter > 0) {
        m.display();
        n.display();
    }
  


   if (leftYes === true) {
        leftPhoto = new Meteor(color(0), 100, 310, 0);
        leftPhoto.display();
    }

    if (rightYes === true) {
        rightPhoto = new Meteor(color(0), 250, 310, 0);
        rightPhoto.display();
    }
    
    //Make a left photo if there's at least one leftclick
    if (counter > 0) {
        noFill();
        strokeWeight(1);
        stroke(0);
        rect(104, 310, 100, 140);
        leftRed = new Train(color(250, 120, 120), 100, 290, 0, leftRedSerial, leftRedClock, -1);
        leftBlue = new Train(color(120, 120, 250), 108, 330, 0, leftBlueSerial, leftBlueClock, 1);
        leftRed.display();
        leftBlue.display();
    }

    if (counter > 1) {
        noFill();
        stroke(1);
        rect(254, 310, 100, 140);
        rightRed = new Train(color(250, 120, 120), 250, 290, 0, rightRedSerial, rightRedClock, -1);
        rightBlue = new Train(color(120, 120, 250), 258, 330, 0, rightBlueSerial, rightBlueClock, 1);
        rightRed.display();
        rightBlue.display();
    }
}


function keyPressed() {
    if (keyCode == UP_ARROW) {
        for (var i = 0; i < trainLength; i ++ ) {
            redtrains[i].forward();
            bluetrains[i].forward();
            if (metcounter > 0) {
                m.forward();
                n.forward();
            }
            timer = timer - 0.000061;
            redtrains[i].clockUpdateForward();
            bluetrains[i].clockUpdateForward();
        }
    } 

    else if (keyCode == DOWN_ARROW) {
        for (var i = 0; i < trainLength; i ++ ) {
            redtrains[i].backward();
            bluetrains[i].backward();
            if (metcounter > 0) {
                m.backward();
                n.backward();
            }
        timer = timer + 0.000061;
        redtrains[i].clockUpdateBackward();
        bluetrains[i].clockUpdateBackward();
        }
    }

    else if (key == " ") {
    	m = new Meteor(0, redtrains[4].xpos, 80, -0.142);
    	n = new Meteor(0, redtrains[4].xpos, 80, 0.142);  // .14 = light speed
    	metcounter++;
	}
}

function mouseClicked() {
	if (mouseButton == LEFT) {  
		//go through each tran. If any red are clicked on, store their info 
		//if there is a photo already, pass it right
  		for (var i = 0; i < trainLength; i ++ ) {
    		if (redtrains[i].clickedOn()) { 
        		if (counter > 0) {
            		rightRedSerial = leftRedSerial;
            		rightRedClock = leftRedClock;
            		rightBlueSerial = leftBlueSerial;
            		rightBlueClock = leftBlueClock;
            		rightYes = leftYes;
        		}
        	leftRedSerial = redtrains[i].serial;
        	leftRedClock = redtrains[i].clock;
        	counter++;

        //check if a blue rocket or meteor is across
        		for (var j = 0; j < bluetrains.length; j ++ ) { 
            		if (bluetrains[j].isAcrossFrom(redtrains[i])) {
                		leftBlueSerial = bluetrains[j].serial;
                		leftBlueClock = bluetrains[j].clock;
                		break;
            		}
            		else {
                		leftBlueSerial = 20;
            		}
        		}

        		if (metcounter > 0) {
            		if (redtrains[i].meteorCheck(m)== true || redtrains[i].meteorCheck(n) ==true) {
                		leftYes = true;
            		}
            		else {
                		leftYes = false;
            		}
        		}
    		
    		break;
    		}

		}

    for (var i = 0; i < trainLength; i ++ ) {
    	//Check if a blue train is clicked on
    	if (bluetrains[i].clickedOn()) {
        	if (counter > 0) {
          		rightRedSerial = leftRedSerial;
          		rightRedClock = leftRedClock;
          		rightBlueSerial = leftBlueSerial;
          		rightBlueClock = leftBlueClock;
          		rightYes = leftYes;
        	}
        leftBlueSerial = bluetrains[i].serial;
        leftBlueClock = bluetrains[i].clock;
        counter++;


        //check if a red rocket or meteor is across
        for (var j = 0; j < trainLength; j ++ ) {
          if (redtrains[j].isAcrossFrom(bluetrains[i])) {
            leftRedSerial = redtrains[j].serial;
            leftRedClock = redtrains[j].clock;
            break;
          }

          else {
            leftRedSerial = 20;
          }
        }

        if (metcounter > 0) {
          if (bluetrains[i].meteorCheck(m)==true || bluetrains[i].meteorCheck(n)==true) {
            leftYes = true;
          }
          else {
            leftYes = false;
          }
        }
        
      }
    }
  }

 
}

function Train(c_, xpos_, ypos_, xspeed_, serial_, offset_, direction_) {
    this.c = c_;
    this.xpos = xpos_;
    this.ypos = ypos_;
    this.xspeed = xspeed_;
    this.serial = serial_;
    this.clock = offset_;
    this.stored = 0;
    this.direction = direction_;


    this.display = function() {
        rectMode(CENTER);
        noStroke();

    //Draw a blank if serial = 20
        if (this.serial == 20) {
            fill(255); 
            rect(this.xpos, this.ypos, 48, 24);
            return 0;
        }

    //Draw rocket
        else {
            fill(this.c);
            rect(this.xpos, this.ypos, 36, 20);
            triangle(this.xpos- this.direction*25, this.ypos, this.xpos-18*this.direction, this.ypos+10, this.xpos-18*this.direction, this.ypos-10); 

      //Write serial number
            fill(0);
            textAlign(CENTER);
            text(this.serial.toString(), this.xpos + 5 -this.direction*3, this.ypos+5);

      //Write clockreading
            textAlign(CENTER);
            text(String(this.clock.toFixed(3)), this.xpos + 1 - 2*this.direction, this.ypos+ 5+ 20*this.direction);
            return this.clock;
        }
    }

    this.forward = function() {
        this.xpos = this.xpos + this.xspeed;
    }

    this.backward = function() {
        this.xpos = this.xpos - this.xspeed;
    }

    this.clockUpdateForward = function() {
        this.clock = this.clock - .000855;
        return this.clock;
    }

    this.clockUpdateBackward = function() {
        this.clock = this.clock + .000855;
        return this.clock;
    }

    this.meteorCheck = function(q) {    //q is a meteor
    	
        if (this.xpos > q.xpos + 4 && this.xpos < q.xpos+10 && this.direction ==1) {
            return true;
        }
        else if (this.xpos > q.xpos - 1.5 && this.xpos < q.xpos+2.5 && this.direction ==-1) {
            return true;
        }
        else {
            return false;
        }
    }

    this.clickedOn = function() {
        if (mouseX < this.xpos + 10 && mouseX > this.xpos -10 && mouseY < this.ypos+30 && mouseY > this.ypos- 30) {
            return true;
        }
        else {
            return false;
        }
    }

    this.isAcrossFrom = function(s) {       //s is a train
        if (this.xpos < s.xpos + 13 && this.xpos > s.xpos-10 && this.direction == 1 ) {
            return true;
        }
        if (this.xpos < s.xpos && this.xpos > s.xpos -13 && this.direction == -1 ) {
            return true;
        }
        else {
            return false;
        }
    }
}

function Meteor(c_, xpos_, ypos_, xspeed_) {
    this.c = c_;
    this.xpos = xpos_;
    this.ypos = ypos_;
    this.xspeed = xspeed_;
  
    this.display = function() {
        ellipse(this.xpos+4, this.ypos, 8, 8);
        return this.xpos;
    }
    
    this.forward = function() {
        this.xpos = this.xpos + this.xspeed;
    }   

    this.backward = function() {
        this.xpos = this.xpos - this.xspeed;
    }
}