

const CAMERA_SMOOTING_FACTOR = 0.05;
var touch_device = false;
var mirror_diam = 40;
var camera_offset_x = 0;
var camera_offset_y = 0;
var mirrors = [];
var selected_mirror = null;

var targets = []
var target = null;

var player_x = 0;
var player_y = 0;


var difficulty = 2;



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
  generate_targets(difficulty);
}

function generate_targets(max_moves) {
  targets = [];
  let level_targets = [{'x': player_x, 'y': player_y}];
  let previous = [...level_targets];
  for (let level = 0; level < max_moves; level++) {
    while (previous.length > 0) {
      // TODO
      let start_point = previous.pop();
      for (let mirror of mirrors) {
        level_targets.push(reflexion_from(mirror, start_point));
      }
    }
    targets.push([...level_targets]);
    previous = [...level_targets];
    level_targets = [];
  }
  select_target();
}

function select_target() {
  while (target == null || abs(target.x) > width/2 || abs(target.x) > width/2) {
    target = targets[difficulty - 1][Math.floor(Math.random() * targets[difficulty - 1].length)];
  }
}

function draw_targets() {
  push();
  rectMode(CENTER);
  noFill();
  for (const level of targets) {
    for (const target of level) {
      rect(target.x, target.y, mirror_diam, mirror_diam);
    }
  }
  pop();
}

function draw_target() {
  if (target !== null) {
    push();
    rectMode(CENTER);
    fill(0, 0, 200);
    rect(target.x, target.y, 2*mirror_diam, 2*mirror_diam);
    pop();
  }
}

function pointed_mirror() {
  for (const mirror of mirrors) {
    if (dist(mirror.x, mirror.y,
             mouseX - width/2 + camera_offset_x,
             mouseY - height/2 + camera_offset_y) <= mirror_diam) {
      return mirror;
    }
  }
  return null;
}

function player_reflexion(mirror) {
  // P' = M - (P - M) = 2M - P
  return {'x': 2*mirror.x - player_x, 'y': 2*mirror.y - player_y};
}

function reflexion_from(mirror, position) {
  // P' = M - (P - M) = 2M - P
  return {'x': 2*mirror.x - position.x, 'y': 2*mirror.y - position.y};
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
    let reflection = player_reflexion(selected_mirror)
    rect(reflection.x, reflection.y, mirror_diam, mirror_diam);
    line(player_x, player_y, reflection.x, reflection.y);
  }
  camera_offset_x -= CAMERA_SMOOTING_FACTOR*(camera_offset_x - player_x);
  camera_offset_y -= CAMERA_SMOOTING_FACTOR*(camera_offset_y - player_y);
  pop();
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  mirror_diam = max(windowWidth, windowHeight)/100;
  generate_mirrors(10);
}

function draw() {
  background(220);
  if (!touch_device) {
    selected_mirror = pointed_mirror();
  }
  translate(width/2 - camera_offset_x, height/2 - camera_offset_y);
  draw_mirrors();
  draw_target();
  draw_player();

}

function keyPressed() {
  return false;
}

function mousePressed() {
  let mirror_pointed = pointed_mirror();
  if (touch_device) {
    selected_mirror = mirror_pointed;
  }
  else {
    if (mirror_pointed != null) {
      jump();
    }

  }
}

function jump(argument) {
  let reflection = player_reflexion(selected_mirror);
  player_x = reflection.x;
  player_y = reflection.y;
  selected_mirror = null;
}

function doubleClicked() {
  return false;
}


function mouseDragged(event) {
  if (touch_device && selected_mirror != null) {
    jump()
  }
  return false;
}


function touchStarted() {
  touch_device = true;
}
