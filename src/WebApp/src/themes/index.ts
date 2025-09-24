import { modernDark } from './modernDark';
import { modernLight } from './modernLight';
import { solarized } from './solarized';
import { solarizedDark } from './solarizedDark';
import { darkDreams } from './darkDreams';
import { highContrast } from './highContrast';

export interface Theme {
  id: string;
  name: string;
  colors: { [key: string]: string };
}

export const themes: Theme[] = [
  modernDark,
  modernLight,
  solarized,
  solarizedDark,
  darkDreams,
  highContrast,
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getDefaultTheme = (): Theme => {
  return modernDark;
};

export { modernDark, modernLight, solarized, solarizedDark, darkDreams, highContrast };
