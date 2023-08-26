import { ColorToSliceType } from './ColorToSliceType';
import { blue, red } from './colors';

export function getColorFromSliceColor(sliceColor: ColorToSliceType) {
  switch (sliceColor) {
    case 'r':
      return red;
    case 'b':
      return blue;
  }
}

export function getSecondaryColorFromSliceColor(sliceColor: ColorToSliceType) {
  switch (sliceColor) {
    case 'r':
      return 'orange';
    case 'b':
      return 'teal';
  }
}
