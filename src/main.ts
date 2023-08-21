import { vec2, setGravity, engineInit, mainContext } from 'littlejsengine/build/littlejs.esm.min';

import { drawTouchLine, updateMouseControls } from './inputUtils';
import { MySvg } from './MySvg';
import { handleLineCollisions, containsUniqueIntersectionPoint } from './handleLineCollisions';

const eggPath =
  'M97.028,21.117C95.398,25.465 92.783,28.488 89.182,30.186C88.231,30.594 87.365,30.916 86.584,31.154C85.803,31.392 84.835,31.443 83.68,31.307C82.525,31.171 81.031,30.848 79.197,30.339C77.363,29.829 74.985,29.065 72.064,28.046C70.638,27.571 69.33,27.163 68.141,26.823C66.953,26.484 65.713,26.212 64.422,26.008C63.132,25.805 61.722,25.635 60.194,25.499C58.665,25.363 56.814,25.227 54.64,25.091C53.893,25.023 53.418,25.091 53.214,25.295C53.01,25.499 52.908,26.11 52.908,27.129C52.772,31.748 52.671,36.368 52.603,40.987C52.535,45.606 52.433,49.851 52.297,53.723C52.161,56.712 51.669,58.784 50.819,59.939C49.97,61.094 48.459,61.603 46.285,61.467C45.062,61.399 44.094,60.89 43.381,59.939C42.668,58.988 42.277,57.222 42.209,54.64C42.074,50.972 41.972,46.727 41.904,41.904C41.836,37.081 41.768,31.918 41.7,26.416C41.7,25.669 41.581,25.21 41.343,25.04C41.106,24.871 40.545,24.786 39.662,24.786C34.907,24.786 30.611,24.904 26.773,25.142C22.935,25.38 19.759,25.703 17.245,26.11C16.362,26.246 15.53,26.416 14.749,26.62C13.968,26.823 13.136,27.044 12.253,27.282C11.37,27.52 10.402,27.825 9.349,28.199C8.296,28.573 7.09,28.997 5.732,29.473C3.694,30.22 2.165,30.101 1.146,29.116C0.127,28.131 -0.212,26.654 0.127,24.684C0.263,23.801 0.892,22.884 2.012,21.933C3.133,20.982 5.12,19.759 7.973,18.264C8.652,17.925 9.502,17.704 10.521,17.602C11.539,17.5 12.524,17.585 13.475,17.857C15.038,18.264 16.838,18.57 18.876,18.774C20.914,18.978 22.714,19.012 24.276,18.876C26.382,18.74 28.726,18.604 31.307,18.468C33.888,18.332 36.707,18.197 39.764,18.061C40.579,17.993 41.089,17.84 41.292,17.602C41.496,17.364 41.598,16.804 41.598,15.921C41.53,14.562 41.496,13.085 41.496,11.489L41.496,6.954C41.496,4.101 41.921,2.165 42.77,1.146C43.619,0.127 44.927,-0.212 46.693,0.127C48.187,0.399 49.393,0.739 50.31,1.146C51.227,1.554 51.906,2.114 52.348,2.828C52.789,3.541 53.061,4.458 53.163,5.579C53.265,6.7 53.282,8.075 53.214,9.705C53.146,10.588 53.129,11.573 53.163,12.66C53.197,13.747 53.18,14.766 53.112,15.717C53.044,16.668 53.112,17.279 53.316,17.551C53.52,17.823 53.995,17.959 54.742,17.959L60.703,17.959C62.775,17.959 64.796,18.027 66.766,18.163C71.113,18.298 74.917,18.4 78.178,18.468C81.438,18.536 84.224,18.57 86.533,18.57C88.843,18.57 90.711,18.536 92.137,18.468C93.564,18.4 94.685,18.332 95.5,18.264C96.587,18.129 97.215,18.281 97.385,18.723C97.555,19.164 97.436,19.963 97.028,21.117Z';
const bambooPath =
  'M38,3.312C27.338,-0.771 14.993,-1.425 0,3.312C4.85,60.645 5.309,117.978 0,175.312C14.691,182.059 26.967,180.757 38,175.312C33.569,119.256 33.587,61.917 38,3.312Z';
// const kabutoEmblem =
//   'M51.793,70.012C46.372,73.975 22.116,73.975 16.695,70.012C13.893,67.963 7.256,48.475 7.695,25.012C8.135,1.549 -2.816,-0.175 0.695,0.012C13.195,0.679 20.862,5.679 28.695,20.012C28.695,20.012 17.792,18.522 16.695,32.012C16.321,36.618 17.862,54.512 20.695,61.012C22.499,65.149 45.99,65.149 47.793,61.012C50.626,54.512 52.167,36.618 51.793,32.012C50.697,18.522 39.793,20.012 39.793,20.012C47.626,5.679 55.293,0.679 67.793,0.012C71.304,-0.175 60.354,1.549 60.793,25.012C61.233,48.475 54.595,67.963 51.793,70.012Z';
// const kabutoHelmFront =
//   'M30.55,6.889C36.139,-2.296 62.99,-2.296 68.579,6.889C74.168,16.074 103.016,61.023 98.55,63.889C94.084,66.755 91.403,58.877 73.256,56.939C66.873,56.352 59.08,55.939 49.66,55.888C49.596,55.888 49.532,55.888 49.469,55.888C40.048,55.939 32.256,56.352 25.872,56.939C7.726,58.877 5.624,63.729 0.579,61.889C-4.466,60.049 24.961,16.074 30.55,6.889Z';
// const kabutoHelmBack =
//   'M89.861,33.262C88.905,23.605 81.516,7.936 70.934,4.045C52.566,-2.709 29.23,0.112 18.201,4.411C7.577,8.552 3.118,22.96 0,31.137C3.487,30.202 8.346,27.444 20.971,26.096C27.355,25.508 35.147,25.095 44.567,25.045C44.631,25.045 44.695,25.045 44.759,25.045C54.179,25.095 61.972,25.508 68.355,26.096C81.324,27.48 86.394,31.899 89.861,33.262Z';
// const kabutoEarL =
//   'M7.343,21.62C10.545,21.62 17.455,4.029 15.343,1.62C13.23,-0.788 2.151,-0.277 1.343,1.62C0.535,3.517 -0.568,13.099 0.343,13.62C1.254,14.141 6.843,21.62 7.343,21.62Z';
// const kabutoEarR =
//   'M8.394,21.62C5.193,21.62 -1.718,4.029 0.394,1.62C2.507,-0.788 13.587,-0.277 14.394,1.62C15.202,3.517 16.306,13.099 15.394,13.62C14.483,14.141 8.894,21.62 8.394,21.62Z';
// const kabutoCap =
//   'M26.448,0.401C4.138,0.69 3.298,-2.068 0.448,4.401C-2.402,10.87 8.62,15.563 25.997,15.401C44.354,15.23 54.61,12.374 52.448,5.373C50.286,-1.628 48.757,0.112 26.448,0.401Z';
let svgs = [];

function gameInit() {
  setGravity(-0.01);

  const eggSvg = new MySvg(eggPath, null, 'blue', 'blue', vec2(444, 444));
  const bambooSvg = new MySvg(bambooPath, null, 'green', 'green', vec2(222, 222));
  const bambooSvg1 = new MySvg(bambooPath, null, 'green', 'green', vec2(233, 232));
  const bambooSvg2 = new MySvg(bambooPath, null, 'green', 'green', vec2(244, 252));
  const bambooSvg3 = new MySvg(bambooPath, null, 'green', 'green', vec2(255, 200));
  // const kabutoEmblemSvg = new MySvg(kabutoEmblem, null, 'gold', 'gold', vec2(115, 100));
  // const kabutoHelmFrontSvg = new MySvg(kabutoHelmFront, null, 'white', 'white', vec2(100, 135));
  // const kabutoHelmBackSvg = new MySvg(kabutoHelmBack, null, 'gray', 'gray', vec2(105, 166));
  // const kabutoEarLSvg = new MySvg(kabutoEarL, null, 'gold', 'gold', vec2(174, 155));
  // const kabutoEarRSvg = new MySvg(kabutoEarR, null, 'gold', 'gold', vec2(110, 155));
  // const kabutoCapSvg = new MySvg(kabutoCap, null, 'orange', 'orange', vec2(123, 166));

  svgs.push(
    eggSvg,
    bambooSvg,
    bambooSvg1,
    bambooSvg2,
    bambooSvg3
    // kabutoEmblemSvg,
    // kabutoHelmFrontSvg,
    // kabutoEarLSvg,
    // kabutoHelmBackSvg,
    // kabutoEarRSvg,
    // kabutoCapSvg
  );
}

function gameUpdate() {
  updateMouseControls();
  svgs.forEach((svg) => {
    svg.update();
    const intersectionPoints = handleLineCollisions(svg);
    intersectionPoints.forEach((p) => {
      if (!containsUniqueIntersectionPoint(svg.intersectionPoints, p)) {
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
  // ctx.font = 'bold 48px serif';
  // ctx.fillText('13th Samurai', 100, 100);

  // ctx.strokeText('Hello world', 50, 100);
}

function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
}

// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
