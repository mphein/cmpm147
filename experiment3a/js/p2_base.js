/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

/*
Used ChatGPT to help author this project.
*/

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let dungeonCount = 6;


function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2Ftileset.png?v=1611654020439"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows, dungeonCount)));
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
}
// 



function draw() {
  randomSeed(seed);
     // Draw black background
  background(0);

  
  
  // Draw the grid and tiles
  drawGrid(currentGrid);
  
  // Set fill color for the fog with constant transparency
  let fogAlpha = 75; // Constant alpha value for the fog
  fill(100, fogAlpha); // Gray with constant transparency
  noStroke(); // Remove outline for the fog

  // Calculate fog position based on time
  let fogX = map(sin(millis() * 0.001), -1, 1, -200, width + 200); // Move fog horizontally and extend beyond the screen width
   let fogY = map(sin(millis() * 0.001 * random(1)), -1, 1, 0, height); 
  let fogWidth = 100; // Width of the fog rectangle
  let fogHeight = height - 200; // Height of the fog rectangle

  // Draw fog rectangle
  rect(fogX, fogY, fogWidth, fogHeight);

// Set fill color for the overlapping rectangle with reduced transparency
  fill(0, 0, 0, 150); // Black with 100/255 transparency
  noStroke(); // Remove outline
  rect(0, 0, width, height); // Draw a rectangle covering the entire canvas
  let alpha = map(sin(millis() * 0.001), -1, 1, 0, 150);
  // Set fill color for the visibility circle with transparency
  fill(255, 255, 0, alpha); // White with 50/255 transparency
  noStroke(); // Remove outline for the ellipse

  // Draw ellipse centered at mouse position
  ellipse(mouseX, mouseY, visionRadius * 2, visionRadius * 2); // Draw ellipse at mouse position
}


function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}


