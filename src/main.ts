import { vec2 } from 'littlejsengine/build/littlejs.esm';

import { engineInit, mainContext } from 'littlejsengine/build/littlejs.esm.min';
import { drawTouchLine, updateMouseControls } from './inputUtils';
import { MySvg } from './MySvg';
import { handleLineCollisions, containsUniqueIntersectionPoint } from './handleLineCollisions';

const eggPath =
  'M121.092,0.717C193.021,7.15 193.764,264.842 70.092,228.717C-73.539,186.761 36.35,-6.863 121.092,0.717Z';
const bambooPath =
  'M38,3.312C27.338,-0.771 14.993,-1.425 0,3.312C4.85,60.645 5.309,117.978 0,175.312C14.691,182.059 26.967,180.757 38,175.312C33.569,119.256 33.587,61.917 38,3.312Z';
let svgs = [];
const somePath =
  'M121.092,0.717C146.847,3.02 163.476,37.537 168.534,79.245C177.602,154.02 149.482,251.907 70.092,228.717C-73.539,186.761 36.35,-6.863 121.092,0.717Z';
function gameInit() {
  const eggSvg = new MySvg(eggPath, null, 'blue', 'blue', vec2(111, 111));
  const bambooSvg = new MySvg(bambooPath, null, 'green', 'green', vec2(222, 222));
  const someSvg = new MySvg(somePath, null, 'orange', 'orange', vec2(333, 555));
  svgs.push(eggSvg, bambooSvg, someSvg);
}

function gameUpdate() {
  updateMouseControls();
  svgs.forEach((svg) => {
    const intersectionPoints = handleLineCollisions(svg);
    intersectionPoints.forEach((p) => {
      if (!containsUniqueIntersectionPoint(svg.intersectionPoints, p.intersectionPoint)) {
        svg.addIntersectionPoint(p);
      }
    });
  });
}

function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
  const ctx = mainContext;
  svgs.forEach((svg) => svg.render(ctx));
  drawTouchLine(ctx);
}

function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
}

// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
