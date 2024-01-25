
const isMobile = navigator.userAgentData.mobile;

var mirror_diam = 40;
var camera_offset_x = 0;
var camera_offset_y = 0;
var mirrors = [];
var selected_mirror = null;

var player_x = 0;
var player_y = 0;



function generate_mirrors(mirror_count) {
  mirrors = [];
  while (mirror_count > mirrors.length) {
    let diam = random(2*mirror_diam, min(height, width)/2);
    let angle = random(0, 2*3.141);
    let new_mirror = {'x': cos(angle)*diam, 'y': sin(angle)*diam};
    for (const mirror of mirrors) {
      if (dist(mirror.x, mirror.y, new_mirror.x, new_mirror.y) < 2*mirror_diam) {
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
             mouseY - height/2 - camera_offset_y) <= mirror_diam) {
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
      fill(100);
    }
    ellipse(mirror.x, mirror.y, 2*mirror_diam, 2*mirror_diam);
    pop();
  }
}

function draw_player() {
  push();
  fill(200, 0, 0);
  rectMode(CENTER);
  rect(player_x, player_y, mirror_diam, mirror_diam);
  if (selected_mirror != null) {
    noFill();
    let reflection = reflexion_point(selected_mirror)
    rect(reflection.x, reflection.y, mirror_diam, mirror_diam);
    line(player_x, player_y, reflection.x, reflection.y);
  }
  pop();
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  mirror_diam = max(windowWidth, windowHeight)/100;
  generate_mirrors(10);
}

function draw() {
  background(220);
  if (!isMobile) {
    selected_mirror = pointed_mirror();
  }
  translate(width/2 + camera_offset_x, height/2 + camera_offset_y);
  draw_mirrors();
  draw_player();

}

function keyPressed() {
  return false;
}

function mousePressed() {
  let mirror_pointed = pointed_mirror();
  if (isMobile) {
    selected_mirror = mirror_pointed;
  }
  else {
    if (mirror_pointed != null) {
      jump();
    }

  }
}

function jump(argument) {
  let reflection = reflexion_point(selected_mirror);
  player_x = reflection.x;
  player_y = reflection.y;
  selected_mirror = null;
}

function doubleClicked() {
  return false;
}


function mouseDragged(event) {
  if (isMobile && selected_mirror != null) {
    jump()
  }
  return false;
}
