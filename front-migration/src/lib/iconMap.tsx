import { ReactComponent as WiDaySunny } from '../svg/wi-day-sunny.svg';
import { ReactComponent as WiNightClear } from '../svg/wi-night-clear.svg';
import { ReactComponent as WiDayRain } from '../svg/wi-day-rain.svg';
import { ReactComponent as WiNightAltRain } from '../svg/wi-night-alt-rain.svg';
import { ReactComponent as WiDaySleet } from '../svg/wi-day-sleet.svg';
import { ReactComponent as WiNightAltSleet } from '../svg/wi-night-alt-sleet.svg';
import { ReactComponent as WiDaySnow } from '../svg/wi-day-snow.svg';
import { ReactComponent as WiNightAltSnow } from '../svg/wi-night-alt-snow.svg';
import { ReactComponent as WiCloud } from '../svg/wi-cloud.svg';
import { ReactComponent as WiNightAltCloudy } from '../svg/wi-night-alt-cloudy.svg';
import { ReactComponent as WiRain } from '../svg/wi-rain.svg';
import { ReactComponent as WiSleet } from '../svg/wi-sleet.svg';
import { ReactComponent as WiSnow } from '../svg/wi-snow.svg';
import { ReactComponent as WiCloudy } from '../svg/wi-cloudy.svg';
import { ReactComponent as WiDayCloudy } from '../svg/wi-day-cloudy.svg';

type ReturnIconMapProps = {
  iconClassname: string;
  cx: number;
  cy: number;
};
export const ReturnIconMap = ({
  iconClassname,
  cx,
  cy,
}: ReturnIconMapProps) => {
  switch (iconClassname) {
    //맑음
    case 'wi wi-day-sunny':
      return (
        <WiDaySunny
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );

    case 'wi wi-day-cloudy':
      return (
        <WiDayCloudy
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-night-alt-cloudy':
      return (
        <WiNightAltCloudy
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-day-rain':
      return (
        <WiDayRain
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-night-alt-rain':
      return (
        <WiNightAltRain
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-day-sleet':
      return (
        <WiDaySleet
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-night-alt-sleet':
      return (
        <WiNightAltSleet
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-day-snow':
      return (
        <WiDaySnow
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-night-alt-snow':
      return (
        <WiNightAltSnow
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
    case 'wi wi-cloud':
      return (
        <WiCloud x={cx - 15} y={cy - 40} width={40} height={50} fill="white" />
      );
    case 'wi wi-rain':
      return (
        <WiRain x={cx - 15} y={cy - 40} width={40} height={50} fill="white" />
      );
    case 'wi wi-snow':
      return (
        <WiSnow x={cx - 15} y={cy - 40} width={40} height={50} fill="white" />
      );

    case 'wi wi-cloudy':
      return (
        <WiCloudy x={cx - 15} y={cy - 40} width={40} height={50} fill="white" />
      );
    default:
      return (
        <WiDaySunny
          x={cx - 15}
          y={cy - 40}
          width={40}
          height={50}
          fill="white"
        />
      );
  }
};
const Iconmap: { [unit: string]: object } = {
  wiDaySunny: <WiDaySunny />,
  wiNightClear: <WiNightClear />,
  wiDayRain: <WiDayRain />,
  wiNightAltRain: <WiNightAltRain />,
  wiDaySleet: <WiDaySleet />,
  wiNightAltSleet: <WiNightAltSleet />,
  wiDaySnow: <WiDaySnow />,
  wiNightAltSnow: <WiNightAltSnow />,
  wiNightAltCloudy: <WiNightAltCloudy />,
  wiCloud: <WiCloud />,
  wiRain: <WiRain />,
  wiSleet: <WiSleet />,
  wiSnow: <WiSnow />,
  wiCloudy: <WiCloudy />,
};

export default Iconmap;
