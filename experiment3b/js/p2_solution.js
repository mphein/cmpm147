/* exported generateGrid, drawGrid */
/* global placeTile */
/*
Used ChatGPT to help author this project.

*/

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  generatePaths(numCols, numRows, grid, '.');
  placeBlock(numCols, numRows, grid, 4, 'g');
  placeBlock(numCols, numRows, grid, 3, 'w');
  
  return grid;
}

function placeBlock(numCols, numRows, grid, waterCount, tile) {
  while (waterCount > 0) {
    let startX = floor(random(0,numCols));
    let startY = floor(random(numRows));
    
    // Generate room size
    let waterSizeX = floor(random(5, 20)); // Random size of block
    let waterSizeY = floor(random(5, 20)); // Random size of block
    
    // Calculate center coordinates
    let centerX = startX + waterSizeX / 2;
    let centerY = startY + waterSizeY / 2;
    
    // Place room in grid
    for (let i = startY; i < startY + waterSizeY && i < numRows; i++) {
      for (let j = startX; j < startX + waterSizeX && j < numCols; j++) {
        // Calculate distance from center
        let distanceX = j - centerX;
        let distanceY = i - centerY;
        let distance = sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Check if cell is within circular/elliptical shape
        if (distance <= waterSizeX / 2) {
          grid[i][j] = tile; // Water tiles
        }
      }
    }
    waterCount--;
  }
}

function generatePaths(numCols, numRows, grid, char) {
  let startX = floor(random(numCols));
  let startY = floor(random(numRows));

  // Mark the starting position as part of the path
  grid[startY][startX] = '.';

  // Set the maximum number of steps for the random walk
  let maxSteps = random(floor(numCols * numRows));

  // Define the possible movements (up, down, left, right)
  const movements = [
    { dx: 0, dy: -1 }, // Up
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }, // Left
    { dx: 1, dy: 0 }   // Right
  ];

  // Perform the random walk
  for (let step = 0; step < maxSteps; step++) {
    // Randomly choose a direction to move
    let movement = movements[floor(random(movements.length))];

    // Calculate the new position
    let newX = startX + movement.dx;
    let newY = startY + movement.dy;

    // Check if the new position is within the grid bounds
    if (newX >= 0 && newX < numCols && newY >= 0 && newY < numRows) {
      // Mark the new position as part of the path
      grid[newY][newX] = char;
      
      // Update the current position
      startX = newX;
      startY = newY;
    }
  }
}

// Checks if target tile exists at location grid[i][j]
function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length) {
    if (j >= 0 && i < grid[0].length) {
      if (grid[i][j] == target) {
        return true;
      }
    }
  }
  return false;
}

// returns a 4-bit code representing if target tile exists at cardinal directions from grid[i][j]
function gridCode(grid, i, j, target) {
  let northBit = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let southBit = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let eastBit = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let westBit = gridCheck(grid, i, j - 1, target) ? 1 : 0;
  
  // Combine the bits into a 4-bit code
  let code = (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
  return code;
}

// based on the "code" returned from gridCode() determines the offset from tilei tilej to slot in the appropriate tile based on context
function drawContext(grid, i, j, target, ti, tj, table) {
  let code = gridCode(grid, i, j, target);
  const [tiOffset, tjOffset] = table[code];
  
  placeTile(i,j, ti + tiOffset, tj + tjOffset);
}


const waterLookup = [
  [0, 0],  //  "0000":
  [0, -1],  //  "0001": north
  [0, 1],  //  "0010": south
  [-1, 0],  //  "0011" north south
  [1, 0],  //  "0100" east
  [1, -1],  //  "0101" east north
  [1, 1],  //  "0110" east south
  [-1, 0],  //  "0111"
  [-1, 0],  //  "1000"
  [-1, -1],  //  "1001" wall
  [-1, 1],  // "1010" wall
  [-1, 0],  //  "1011" ore
  [1, 1],  //  "1100" wall
  [0, -1],  //  "1101" smooth tile
  [0, 1],  //  "1110" tower
  [0, 1]  //  "1111" water
];

const treeLookup = [
  [-2, -1],  //  "0000":
  [0, -1],  //  "0001": north
  [0, 1],  //  "0010": south
  [-2, 1],  //  "0011" north south
  [-1, 1],  //  "0100" east
  [-1, 1],  //  "0101" east north
  [-1, -1],  //  "0110" east south
  [-1, 0],  //  "0111"
  [1, 1],  //  "1000"
  [1, 1],  //  "1001" 
  [1, -1],  // "1010" 
  [1, 0],  //  "1011" 
  [0, 1],  //  "1100" 
  [0, 1],  //  "1101" 
  [0, -1],  //  "1110" 
  [0, 0]  //  "1111" 
];

function drawGrid(grid) {
  background(0, 255, 0);
  renderBackground(grid);
  if (random() > .5) {
    // trees
    renderBackground(grid);
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j, '.')) {
          placeTile(i, j, random(0,3) | 0, 0);
          drawContext(grid,i,j,'.',16, 1, treeLookup) 
        }
      }
    }

    // dark grass
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j, 'g')) {
          placeTile(i, j, random(0,3) | 0, 1);
          drawContext(grid, i, j, '_', 5, 1, waterLookup);
          drawContext(grid, i, j, 'w', 5, 1, waterLookup);
        }
      }
    }

    // water
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j, 'w')) {
          placeTile(i, j, random(0,3) | 0, 14);
          drawContext(grid, i, j, '_', 10, 1, waterLookup);
          drawContext(grid, i, j, '.', 10, 1, waterLookup);
          drawContext(grid, i, j, 'g', 10, 1, waterLookup);
        }
      }
    }
    spawnHouse(grid, 26);
  } else {
    // trees
    renderBackground2(grid);
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j, '.')) {
          placeTile(i, j, random(0,3) | 0, 12);
          drawContext(grid,i,j,'.',16, 13, treeLookup) 
        }
      }
    }

    // dark grass
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j, 'g')) {
          placeTile(i, j, random(0,3) | 0, 13);
          drawContext(grid, i, j, '_', 5, 13, waterLookup);
          drawContext(grid, i, j, 'w', 5, 13, waterLookup);
        }
      }
    }

    // water
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if (gridCheck(grid,i,j, 'w')) {
          placeTile(i, j, random(0,3) | 0, 14);
          drawContext(grid, i, j, '_', 22, 13, waterLookup);
          drawContext(grid, i, j, '.', 22, 13, waterLookup);
          drawContext(grid, i, j, 'g', 22, 13, waterLookup);
        }
      }
    }
    spawnHouse(grid, 27);
  }

  
}

// water motion
function updateWater(grid, time) {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCode(grid,i,j,'w') == 15) {
        placeTile(i, j, (time * .0001 * random(0,3) | 0) % 3, 14);
      }
    }
  }
}

// base layer random background grass
function renderBackground(grid) {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid,i,j,'_')) {
        placeTile(i, j, random(0,3) | 0, 0);
      }
    }
  }
}

function renderBackground2(grid) {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid,i,j,'_')) {
        placeTile(i, j, random(0,3) | 0, 12);
      }
    }
  }
}



function spawnHouse(grid, x) {
  let house = false
  while (!house) {
    let xPos = floor(random(0, grid.length));
    let yPos = floor(random(0, grid[0].length));
    if (!gridCheck(grid, xPos, yPos, 'w') && !gridCheck(grid, xPos, yPos, '.')) {
      placeTile(xPos, yPos, x, random(0,4) | 0);
      house = true;
    }
  }
}





