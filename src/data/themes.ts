import { hexToRgb, IRgbColor } from '../util/colorUtils';

export interface ITheme {
  name: string;
  mainColor: IColor;
  discVolumeOffColor: IColor;
  discVolumeOnColor: IColor;
  waveColor: IColor;
  flashColor: IColor;
  invertUi: boolean;
}

export const themes: ITheme[] = [
  {
    name: 'Test theme #1',
    mainColor: createColor('00bfff'), // todo just use hex vars here and convert elsewhere
    discVolumeOffColor: createColor('00bfff'),
    discVolumeOnColor: createColor('ffffff'),
    flashColor: createColor('000000'),
    waveColor: createColor('FFFFFF'),
    invertUi: false,
  },
  {
    name: 'Test theme #2',
    mainColor: createColor('FF0000'),
    discVolumeOffColor: createColor('FF0000'),
    discVolumeOnColor: createColor('000000'),
    flashColor: createColor('000000'),
    waveColor: createColor('000000'),
    invertUi: true,
  },
];

function createColor(hex: string): IColor {
  return {
    hex: `#${hex}`,
    rgb: hexToRgb(hex),
  };
}

export interface IColor {
  hex: string;
  rgb: IRgbColor;
}
