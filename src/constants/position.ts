export enum Position {
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
}

export const OppositePosition = {
  [Position.BOTTOM]: Position.TOP,
  [Position.LEFT]: Position.RIGHT,
  [Position.RIGHT]: Position.LEFT,
  [Position.TOP]: Position.BOTTOM,
};
