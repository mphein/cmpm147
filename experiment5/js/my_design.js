/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Spinning top", 
      assetUrl: "https://cdn.glitch.global/069ca2b1-dff8-47f3-ae9c-abf0c6e04d89/top.jpg?v=1714880490523",
      credit: "https://www.artofplay.com/cdn/shop/products/TungsteneTop.png?v=1636417098&width=1024"
    },
    {
      name: "Mountain", 
      assetUrl: "https://cdn.glitch.global/069ca2b1-dff8-47f3-ae9c-abf0c6e04d89/DSC01618.jpg?v=1715026572116",
      credit: "Mountain by Michael Hein"
    },
    {
      name: "Googly", 
      assetUrl: "https://cdn.glitch.global/069ca2b1-dff8-47f3-ae9c-abf0c6e04d89/googly.jpg?v=1715034594139",
      credit: "Googly eyes https://m.media-amazon.com/images/I/61IdJ9TPfKL._AC_UF894,1000_QL80_.jpg"
    },
    {
      name: "Stars", 
      assetUrl: "https://cdn.glitch.global/069ca2b1-dff8-47f3-ae9c-abf0c6e04d89/DSC01799%20(1).jpg?v=1715031461320",
      credit: "Starry Night, Michael Hein"
    },
  ];
}
function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  let design = {
    bg: 0,
    shapes: []
  };
  if (inspiration.name == "Googly") {
    // Add half circles
    for(let i = 0; i < 1000; i++) {
      design.shapes.push({
        type: 'circle',
        x: random(width),
        y: random(height),
        radius: random(width*.01), // Adjust the radius range as needed
        fill: random(255),
        max: .1,
        bg: 255
      });
    }
  } else if (inspiration.name == "Spinning top") {
    // Add half triangles
    for(let i = 0; i < 100; i++) {
      design.bg = random(255)
      design.shapes.push({
        type: 'triangle',
        x1: random(width),
        y1: random(height),
        x2: random(width),
        y2: random(height),
        x3: random(width),
        y3: random(height),
        fill: random(255)
      });
    }
  } else if (inspiration.name == "Mountain") {
    design.bg = random(255)
    for(let i = 0; i < 100; i++) {
      design.shapes.push({
        type: 'circle',
        x: random(width),
        y: random(height),
        radius: random(width/8), // Adjust the radius range as needed
        fill: random(255),
        max: .2
      })
    }
    for(let i = 0; i < 100; i++) {
      design.shapes.push({
        type: 'triangle',
        x1: random(width),
        y1: random(height),
        x2: random(width),
        y2: random(height),
        x3: random(width),
        y3: random(height),
        fill: random(255)
      });
    }
  } else if (inspiration.name == "Stars") {
    design.bg = random(255)
    for(let i = 0; i < 10000; i++) {
      design.shapes.push({
        type: 'circle',
        x: random(0, width),
        y: random(0, height),
        radius: random(width*.001), // Adjust the radius range as needed
        fill: random(255),
        max: .009
      })
    }
    for(let i = 0; i < 100; i++) {
      design.shapes.push({
        type: 'rectangle',
        x: random(width/2, width),
        y: random(2/3 * height, height),
        w: random(width/2),
        h: random(height/2),
        fill: random(255)
      });
    }
    
  }
  return design;
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke(); // Add this line to remove strokes from all shapes

  for(let shape of design.shapes) {
    if(shape.type === 'circle') {
      fill(shape.fill, random(255));
      ellipse(shape.x, shape.y, shape.radius * 2, shape.radius * 2);
    } else if(shape.type === 'triangle') {
      fill(shape.fill, random(255));
      beginShape();
      vertex(shape.x1, shape.y1);
      vertex(shape.x2, shape.y2);
      vertex(shape.x3, shape.y3);
      endShape(CLOSE);
    } else if(shape.type === "rectangle") {
      fill(shape.fill, random(255));
      rect(shape.x, shape.y, shape.w, shape.h);
    }  
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  for(let shape of design.shapes) {
    if(shape.type === 'circle') {
      shape.fill = mut(shape.fill, 0, 255, rate);
      shape.x = mut(shape.x, 0, width, rate);
      shape.y = mut(shape.y, 0, height, rate);
      shape.radius = mut(shape.radius, 0, width *shape.max, rate); // Adjust the radius mutation range
    } else if(shape.type === 'triangle') {
      shape.fill = mut(shape.fill, 0, 255, rate);
      shape.x1 = mut(shape.x1, 0, width, rate);
      shape.y1 = mut(shape.y1, 0, height, rate);
      shape.x2 = mut(shape.x2, 0, width, rate);
      shape.y2 = mut(shape.y2, 0, height, rate);
      shape.x3 = mut(shape.x3, 0, width, rate);
      shape.y3 = mut(shape.y3, 0, height, rate);
    } else if(shape.type === "rectangle") {
      shape.fill = mut(shape.fill, 0, 255, rate);
      shape.x = mut(shape.x, 0, width, rate); // Adjust the mutation range for x-coordinate
      shape.y = mut(shape.y, 0, height, rate);
      shape.w = mut(shape.w, 0, width, rate);
      shape.h = mut(shape.h, 0, height, rate);
    }
  }
}


function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
}
