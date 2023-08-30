import { vec2 } from 'littlejsengine/build/littlejs.esm';
import { INftCollection } from './INftCollection';
import { MySvg } from './MySvg';
import { handleSvgCollisions } from './handleSvgCollisions';
import { darkPink } from './colors';

export class HaloSaber {
  handleSvg: MySvg;
  swordPart1Svg: MySvg;
  swordPart2Svg: MySvg;

  constructor(collection: INftCollection) {
    collection.metadata.attributes.forEach((a) => {
      console.log('', a.trait_type);
      switch (a.trait_type) {
        case 'Handle':
          this.handleSvg = new MySvg(a.value, null, null, 'white');
          this.handleSvg.setGravityScale(0);
          this.handleSvg.translateSvg(vec2(2, 128));
          break;
        case 'Sword part1':
          this.swordPart1Svg = new MySvg(a.value, null, null, darkPink);
          this.swordPart1Svg.setGravityScale(0);
          break;
        case 'Sword part2':
          this.swordPart2Svg = new MySvg(a.value, null, null, darkPink);
          this.swordPart2Svg.setGravityScale(0);
          this.swordPart2Svg.translateSvg(vec2(40, 3));
          break;
      }
    });
    this.getSvgs().forEach((svg) => {
      svg.translateSvg(vec2(150, 300));
    });
  }
  update() {
    this.getSvgs().forEach((svg) => {
      svg.update();
      handleSvgCollisions(svg, 2);
    });
  }
  render(ctx) {
    this.getSvgs().forEach((svg) => svg.render(ctx));
  }
  getSvgs() {
    const svgs = [];
    if (this.swordPart1Svg) svgs.push(this.swordPart1Svg);
    if (this.swordPart2Svg) svgs.push(this.swordPart2Svg);
    if (this.handleSvg) svgs.push(this.handleSvg);
    return svgs;
  }
}
