// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let button

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// listener for reimagine button
$("#reimagine").click(function() {
  seed++;
});

// setup() function is called once when the program starts
function setup() {

  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");
  for (let i = 0; i < 10; i++) {
    cloudXOffsets.push(random(width)); // Random initial x-coordinate for each cloud
  } 
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
// Used ChatGPT to help draw function
/* exported setup, draw */

const snowColor = "#E8ECF5";
const skyColor = "#4294D3";
const stoneColor = "#3B425F";
const treeColor = "#2E3A37";
const cloudColor = "#D4DAE8"

/* exported setup, draw */
let seed = 0;
let cloudXOffsets = []; // Array to store initial x-coordinates for clouds

function draw() {
    randomSeed(seed)
    background(skyColor);

    let mountainLine = []; // Array to store the y-coordinates of the mountain line

    for (let x = 0; x < width; x++) {
        let noiseFactor = noise(seed * 0.1, x * 0.04); // Include seed in noise calculation
        let mountainHeight = map(pow(noiseFactor, 3), 0, 1, height * (1/2), height / 1.5); // Map the noise value to a height range (flipped)

        // Add a secondary noise factor to create pointier tips
        let pointiness = noise(seed * 0.2, x * 0.1); // Adjust these parameters for different pointiness
        let pointyHeight = map(pointiness, 0, 1, -50, 50); // Adjust the range of pointiness

        // Smoothly blend the original mountain height with the pointy height
        let blendedHeight = lerp(mountainHeight, mountainHeight + pointyHeight, 0.5); // Adjust the blending factor (0.5 for equal blend)

        mountainLine.push(blendedHeight);
    }
  
    // Draw the mountain line
    stroke(stoneColor);
    fill(snowColor); // Fill below the mountain line with the stone color
    beginShape();
    vertex(0, height); // Start from the bottom-left corner
    for (let x = 0; x < width; x++) {
        vertex(x, mountainLine[x]);
    }
    vertex(width, height); // End at the bottom-right corner
    endShape(CLOSE); // Close the shape
  
  
  
    let mountainLine2 = [];
    for (let x = 0; x < width / 2; x++) {
        let noiseFactor = noise(seed * 0.1, x * 0.04); // Include seed in noise calculation
        let mountainHeight2 = map(pow(noiseFactor, 3), 0, 1, height * 0.9, height / 2 ); // Map the noise value to a height range (flipped)
        
        // Add a secondary noise factor to create pointier tips
        let pointiness2 = noise(seed * 0.2, x * 0.05); // Adjust these parameters for different pointiness
        let pointyHeight2 = map(pointiness2, 0, 1, 0, 50); // Adjust the range of pointiness
        
        // Smoothly blend the original mountain height with the pointy height
        let blendedHeight2 = lerp(mountainHeight2, mountainHeight2 + pointyHeight2, 0.5); // Adjust the blending factor (0.5 for equal blend)
        
        mountainLine2.push(blendedHeight2);
    }

    stroke(stoneColor);
    fill(stoneColor);
    beginShape();
    vertex(0, height);
    for (let x = 0; x < width / 2; x++) {
        vertex(x, mountainLine2[x]);
    }
    vertex(width / 2, height);
    endShape(CLOSE);
    
    // Draw the third mountain line
    let mountainLine3 = [];
    for (let x = width / 2; x < width; x++) {
        let noiseFactor = noise(seed * 0.1, x * 0.04); // Include seed in noise calculation
        let mountainHeight3 = map(pow(noiseFactor, 3), 0, 1, height * 0.9, height / 2); // Map the noise value to a height range (flipped)
        
        // Add a secondary noise factor to create pointier tips
        let pointiness3 = noise(seed * 0.2, x * 0.05); // Adjust these parameters for different pointiness
        let pointyHeight3 = map(pointiness3, 0, 1, 0, 50); // Adjust the range of pointiness
        
        // Smoothly blend the original mountain height with the pointy height
        let blendedHeight3 = lerp(mountainHeight3, mountainHeight3 + pointyHeight3, 0.5); // Adjust the blending factor (0.5 for equal blend)
        
        mountainLine3.push(blendedHeight3);
    }

    stroke(stoneColor);
    fill(stoneColor);
    beginShape();
    vertex(width / 2, height);
    for (let x = width / 2; x < width; x++) {
        vertex(x, mountainLine3[x - width / 2]);
    }
    vertex(width, height);
    endShape(CLOSE);
  
 
 //Draw triangular trees
  fill(treeColor);
 for (let i = 0; i < 3000; i++) { // Draw 1000 trees
      let x = random(width); // Random x-coordinate
      let y = random(mountainLine[floor(x)] + 15, height); // Random y-coordinate below the mountains
      let noiseX = x * random(0.1, seed); // Adjust these parameters for different clustering
      let noiseY = y * random(0.1, seed); // Adjust these parameters for different clustering
      let cluster = noise(noiseX, noiseY); // Use noise to determine tree clustering
      if (cluster > .5) { // Draw tree based on cluster noise
          let size = map(y, height, mountainLine[floor(x)], 10, 1); // Map size to the y-coordinate
        triangle(x, y - size, x - size / 2, y + size, x + size / 2, y + size); // Draw triangle as tree
      }
  }
      drawClouds();
}

function drawClouds() {
    fill(cloudColor);
    noStroke();

    let time = millis(); // Get current time in milliseconds

    for (let i = 0; i < 20; i++) { // Draw 20 clouds
        let x = (width - (time * 0.05 + cloudXOffsets[i]) % width); // Calculate x-coordinate based on time
        let y = random(50, height / 3); // Random y-coordinate within the top third of the canvas
        let size = random(25, 100); // Random size for the cloud
        ellipse(x, y, size, size / 2); // Draw ellipse as cloud
        ellipse(x + size / 4, y - size / 4, size / 1.5, size / 1.5); // Draw another ellipse as cloud
        ellipse(x + size / 2, y, size, size / 2); // Draw another ellipse as cloud
    }
}






// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}