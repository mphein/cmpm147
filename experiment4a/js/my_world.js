"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let map_factor
function p3_preload(
) {
}

function p3_setup() {  
}

let worldSeed;
let roadWidth;
let roadOffset = [];
let sparkle = true;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  roadWidth = random(10, 20); // maybe 10 - 100
  map_factor = floor(random(0,3))
  
  
  // fill road
  for (let i = 0; i < 1000; i++) {
    let noiseVal = noise(i * .05);
    
    // Map the noise value to a suitable range for road offsets
    let offset = map(noiseVal, 0, 1, -10, 10); // Adjust the range as needed
    
    // Store the offset in the array
    roadOffset[i] = offset;
  }
}

function p3_tileWidth() {
  return 12;
}
function p3_tileHeight() {
  return 6;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  let offset = roadOffset[abs(i) % 1000];
  
  if (j >= -roadWidth - offset && j <= roadWidth - offset) {
    colorRow(i, j)
  } else {
    space(i, j);
  }
  push();
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    if (sparkle) {
      fill(random(0,255),random(0,255),random(0,255))
    } else {
      fill(255, 215, 0); // Set fill color to golden yellow
    }
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
    
     

    translate(-12, -75);
  
    rect(0, 0, 25, 25);
  }
  pop();
}


function toggleSparkle() {
  sparkle = !sparkle;
}


function colorRow(i, j) {
  let colorGradient;
  let n;
  if (map_factor == 0) {
    n = noise(i * .0001, j * .5); // vertica lines more frequent changes
  } else if (map_factor == 1) {
    n = noise(i * .1, j * .0001); // horizontal lines
  } else {
    n = noise(i * .1, j * .1); // very random map
  } 

  let colorIndex = floor(map(n, 0, 1, 0, 7)); // Map noise value to color index
  if (sparkle) {
    switch (colorIndex) {
    case 0:
      // Red
      colorGradient = map(n, 0, 1, 266, 30); // Map noise value to color range
      fill(random(colorGradient - 50, colorGradient + 50), 0, 0);
      break;
    case 1:
      // Orange
      colorGradient = map(n, 0, 1, 255, 165); // Map noise value to color range
      fill(random(colorGradient - 50, colorGradient + 50), map(n, 0, 1, 69, 0), 0);
      break;
    case 2:
      // Yellow
      colorGradient = map(n, 0, 1, 255, 0); // Map noise value to color range
      fill(random(colorGradient - 50, colorGradient + 50), random(colorGradient -  50, colorGradient +  50), 0);
      break;
    case 3:
      // Green
      colorGradient = map(n, 0, 1, 0, 255); // Map noise value to color range
      fill(0, random(colorGradient - 50, colorGradient + 50), 0);
      break;
    case 4:
      // Blue
      colorGradient = map(n, 0, 1, 0, 255); // Map noise value to color range
      fill(0, 0, random(colorGradient - 50, colorGradient + 50));
      break;
    case 5:
      // Indigo
      colorGradient = map(n, 0, 1, 75, 0); // Map noise value to color range
      fill(random(colorGradient - 50, colorGradient + 50), 0, map(n, 0, 1, 130, 255));
      break;
    case 6:
      // Violet
      colorGradient = map(n, 0, 1, 238, 75); // Map noise value to color range
      fill(random(colorGradient - 50, colorGradient + 50), map(n, 0, 1, 130, 0), random(colorGradient - 50, colorGradient + 50))
      break;
    default:
      // Handle any other case
      break;
    }
  } else {
    switch (colorIndex) {
    case 0:
      // Red
      colorGradient = map(n, 0, 1, 266, 30); // Map noise value to color range
      fill(colorGradient, 0, 0);
      break;
    case 1:
      // Orange
      colorGradient = map(n, 0, 1, 255, 165); // Map noise value to color range
      fill(colorGradient, map(n, 0, 1, 69, 0), 0);
      break;
    case 2:
      // Yellow
      colorGradient = map(n, 0, 1, 255, 0); // Map noise value to color range
      fill(colorGradient, colorGradient, 0);
      break;
    case 3:
      // Green
      colorGradient = map(n, 0, 1, 0, 255); // Map noise value to color range
      fill(0, colorGradient, 0);
      break;
    case 4:
      // Blue
      colorGradient = map(n, 0, 1, 0, 255); // Map noise value to color range
      fill(0, 0, colorGradient);
      break;
    case 5:
      // Indigo
      colorGradient = map(n, 0, 1, 75, 0); // Map noise value to color range
      fill(colorGradient, 0, map(n, 0, 1, 130, 255));
      break;
    case 6:
      // Violet
      colorGradient = map(n, 0, 1, 238, 75); // Map noise value to color range
      fill(colorGradient, map(n, 0, 1, 130, 0), colorGradient)
      break;
    default:
      // Handle any other case
      break;
    }
  }
 
}

function space(i, j) {
  let colorGradient;
  let n = noise(i * .1, j * .1); // Adjust the scale factor as needed

  colorGradient = map(n, 0, 1, 0, 150); // Map noise value to color range (black to gray)
  
  fill(colorGradient);
}

function getColorForTile(i, j) {
  // Define the direction-based colors
  let directionColors = [
    [255, 0, 0],    // Red
    [255, 165, 0],  // Orange
    [255, 255, 0],  // Yellow
    [0, 255, 0],    // Green
    [0, 0, 255],    // Blue
    [75, 0, 130],   // Indigo
    [238, 130, 238] // Violet
  ];

  // Define the direction vectors for each color
  let directionVectors = [
    [1, 0],   // Right (Red)
    [0, 1],   // Up (Orange)
    [-1, 0],  // Left (Yellow)
    [0, -1],  // Down (Green)
    [1, 1],   // Up-right (Blue)
    [-1, 1],  // Up-left (Indigo)
    [-1, -1]  // Down-left (Violet)
  ];

  // Calculate the direction of the tile relative to the origin
  let dx = i;
  let dy = j;
  let direction = -1;

  // Find the direction index
  for (let k = 0; k < directionVectors.length; k++) {
    let [vx, vy] = directionVectors[k];
    if (dx === vx && dy === vy) {
      direction = k;
      break;
    }
  }

  // If the tile is at the origin or not in any specific direction, choose a random color
  if (i === 0 && j === 0) {
    return directionColors[Math.floor(random(directionColors.length))];
  } else if (direction === -1) {
    return directionColors[Math.floor(random(directionColors.length))];
  } else {
    return directionColors[direction];
  }
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
