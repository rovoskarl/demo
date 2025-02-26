import Svg, { Path } from 'react-native-svg';

export const Mute = (props: any) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={22.19967269897461}
      height={22.066566467285156}
      viewBox="0 0 22.19967269897461 22.066566467285156"
      {...props}
    >
      <Path
        d="M20.467 22.067L.05 1.65 1.7 0l20.417 20.417-1.65 1.65zM9.917 3.737V6.95h2.333V1.248c0-1.061-1.256-1.62-2.044-.91l-2.82 2.536L8.947 4.61l.97-.873zm8.937 11.456c1.768-3.665 1.245-7.76-1.754-10.76l1.65-1.65c3.744 3.745 4.378 8.922 2.206 13.424l-2.102-1.014zm-16.52-7.66h.583V5.2H1.225C.548 5.2 0 5.748 0 6.425v9.217c0 .676.548 1.225 1.225 1.225h3.577l5.404 4.863c.788.709 2.044.15 2.044-.911v-5.702H9.917v3.213l-4.22-3.797H2.334v-7zm12.799 4.233c.453-1.132-.058-2.758-1.333-4.033l1.65-1.65c1.6 1.6 2.797 4.183 1.85 6.55l-2.167-.867z"
        fillRule="evenodd"
        fill={props.color || '#fff'}
      />
    </Svg>
  );
};
