const colors = require('tailwindcss/colors');
const defaultColors = require('./colors');
import React, { FC, ReactNode, useContext } from 'react';

interface Props {
  children: ReactNode;
}

delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

const ThemeContext = React.createContext({
  // ...Theme,
  colors: {
    ...colors,
    ...defaultColors,
    black: '#000',
  },
});

const ThemeProvide: FC<Props> = ({ children }) => {
  const theme = useContext(ThemeContext);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
  const theme = useContext(ThemeContext);
  return theme;
};

export { defaultColors, useTheme, ThemeProvide };
