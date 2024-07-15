import { tokens } from '@tamagui/themes';
import { createTamagui } from 'tamagui';
import { config as tamaguiConfig } from '@tamagui/config/v2-native';
import { createAnimations } from '@tamagui/animations-moti';

interface Variable<A = any> {
  isVar?: true;
  variable?: string;
  val: A;
  name: string;
  key: string;
}

function postfixObjKeys<A extends { [key: string]: Variable<string> | string }, B extends string>(
  obj: A,
  postfix: B,
): {
  [Key in `${keyof A extends string ? keyof A : never}${B}`]: Variable<string> | string;
} {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${k}${postfix}`, v])) as any;
}

const white = '#FFFFFF';
const warn = '#E67470';
const hover = '#3f68fdcc';
const primary = {
  primary: '#00BBB4',
  primary1: 'rgba(0, 187, 180, 0.1)',
  primary6: 'rgba(0, 187, 180, 0.6)',
  primary10: 'rgba(0, 187, 180, 0)',
};
const black = {
  black: '#000000',
  black2: 'rgba(0, 0, 0, 0.25)',
  black3: 'rgba(0, 0, 0, 0.3)',
  black4: 'rgba(0, 0, 0, 0.45)',
  black5: 'rgba(0, 0, 0, 0.6)',
  black6: 'rgba(0, 0, 0, 0.65)',
  black7: 'rgba(0, 0, 0, 0.8)',
  black8: 'rgba(0, 0, 0, 0.85)',
  black9: 'rgba(0, 0, 0, 0.9)',
  black10: 'rgba(0, 0, 0, 0)',
};
const colors = {
  disabled: '#F9B5BD',
  white,
  warn,
  hover,
  borderGray: '#eee',
  bgGray: '#f8f8f8',
  textLightBlack: '#333',
  pageColor: '#F7F8FA',
  ...postfixObjKeys(primary, 'Light'),
  ...postfixObjKeys(black, 'Light'),
};

const animations = createAnimations({
  '100ms': {
    type: 'timing',
    duration: 100,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
  lazy: {
    damping: 18,
    stiffness: 50,
  },
  medium: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
  slow: {
    damping: 15,
    stiffness: 40,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  tooltip: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const config = createTamagui({
  ...tamaguiConfig,
  tokens: {
    ...tokens,
    space: Object.assign(tokens.space, { 4.2: 20, 7.5: 40 }),
    size: Object.assign(tokens.size, { 0.85: 16 }),
    color: Object.assign(tokens.color, colors),
    radius: Object.assign(tokens.radius, { 3.5: 8, 8.5: 24 }),
  },
  animations,
});

export default config;
