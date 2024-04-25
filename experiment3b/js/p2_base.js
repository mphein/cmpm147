/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

/*
Used ChatGPT to help author this project.
*/

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let clouds = []; // Array to store cloud objects
let numClouds = 5; // Number of clouds
let cloudSpeed = 1; // Speed of clouds
let cloudWidth = 50; // Width of clouds
let cloudHeight = 25; // Height of clouds

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2Ftileset.png?v=1611654020439"
  );
}

function reseed() {
  seed = (seed | 0) + (random(10, 1000) | 0);
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
  generateClouds();
}


function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
  currTime = millis();
  updateWater(currentGrid, currTime);

  for (let cloud of clouds) {
    cloud.move();
    cloud.display();
  }
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function generateClouds() {
  for (let i = 0; i < numClouds; i++) {
    let x = random(width); // Random x-position
    let y = random(0, height); // Random y-position
    clouds.push(new Cloud(x, y));
  }
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move() {
    // Move the cloud to the right
    this.x += cloudSpeed;
    // If the cloud moves off the screen, reset its position to the left
    if (this.x > width) {
      this.x = -cloudWidth;
    }
  }

  display() {
    // Draw the cloud
    fill(200, 255);
    noStroke();
    ellipse(this.x, this.y, cloudWidth, cloudHeight);
    ellipse(this.x - cloudWidth * 0.4, this.y, cloudWidth * 0.8, cloudHeight * 0.8);
    ellipse(this.x + cloudWidth * 0.4, this.y, cloudWidth * 0.8, cloudHeight * 0.8);
  }
}

