
const MIRROR_DIAM = 20;


var camera_offset_x = 0;
var camera_offset_y = 0;
var mirrors = [];
var selected_mirror = null;

var player_x = 0;
var player_y = 0;



function generate_mirrors(mirror_count) {
  mirrors = [];
  while (mirror_count > mirrors.length) {
    let diam = random(2*MIRROR_DIAM, min(height, width)/2);
    let angle = random(0, 2*3.141);
    let new_mirror = {'x': cos(angle)*diam, 'y': sin(angle)*diam};
    for (const mirror of mirrors) {
      if (dist(mirror.x, mirror.y, new_mirror.x, new_mirror.y) < 2*MIRROR_DIAM) {
        new_mirror = null;
        break;
      }
    }
    if (new_mirror != null) {
      mirrors.push(new_mirror);
    }
  }
}

function pointed_mirror() {
  for (const mirror of mirrors) {
    if (dist(mirror.x, mirror.y,
             mouseX - width/2 - camera_offset_x,
             mouseY - height/2 - camera_offset_y) <= MIRROR_DIAM) {
      return mirror;
    }
  }
  return null;
}

function reflexion_point(mirror) {
  // P' = M - (P - M) = 2M - P
  return {'x': 2*mirror.x - player_x, 'y': 2*mirror.y - player_y}
}

function draw_mirrors() {
  for (const mirror of mirrors) {
    push();
    if (mirror == selected_mirror) {
      fill(50);
    }
    ellipse(mirror.x, mirror.y, 2*MIRROR_DIAM, 2*MIRROR_DIAM);
    pop();
  }
}

function draw_player() {
  push();
  rectMode(CENTER);
  rect(player_x, player_y, MIRROR_DIAM, MIRROR_DIAM);
  if (selected_mirror != null) {
    noFill();
    let reflection = reflexion_point(selected_mirror)
    rect(reflection.x, reflection.y, MIRROR_DIAM, MIRROR_DIAM);
    line(player_x, player_y, reflection.x, reflection.y);
  }
  pop();
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  generate_mirrors(10);
}

function draw() {
  background(220);
  translate(width/2 + camera_offset_x, height/2 + camera_offset_y);
  draw_mirrors();
  draw_player();

}

function keyPressed() {
  return false;
}

function mousePressed() {
  selected_mirror = pointed_mirror();
}

function doubleClicked() {
  if (selected_mirror != null) {
    let reflection = reflexion_point(selected_mirror);
    player_x = reflection.x;
    player_y = reflection.y;
    selected_mirror = null;
  }

  return false;
}


function mouseDragged(event) {
  //console.log(event);
  return false;
}
