import { modernDark } from './modernDark';
import { modernLight } from './modernLight';
import { solarized } from './solarized';
import { darkDreams } from './darkDreams';

export interface Theme {
  id: string;
  name: string;
  colors: { [key: string]: string };
}

export const themes: Theme[] = [
  modernDark,
  modernLight,
  solarized,
  darkDreams,
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getDefaultTheme = (): Theme => {
  return modernDark;
};

export { modernDark, modernLight, solarized, darkDreams };
