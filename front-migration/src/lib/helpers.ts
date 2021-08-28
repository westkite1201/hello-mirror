import { ComponentItem } from '../store/edit/reducer';

export const handleDispatchEventResize = () => {
  const event = new CustomEvent('resize', {
    bubbles: false,
  });
  window.dispatchEvent(event);
  setTimeout(() => {
    window.dispatchEvent(event);
  }, 10);
};
export const searchComponentByName = (
  componentList: ComponentItem[],
  thisComponentName: string,
) => {
  const item = componentList.filter(item => item.name === thisComponentName)[0];
  const tag = item.component;
  // console.log(item);
  // console.log(tag);
  return tag;
};

export const getWeatherClassName = (skyInfoStr: string, dayTimeYn: boolean) => {
  let className = '';
  let weatherInfoName = '';
  // sky
  // ① 1 : 맑음
  // ② 2 : 구름조금
  // ③ 3 : 구름많음
  // ④ 4 : 흐림

  // pty
  // ① 0 : 없음
  // ② 1 : 비
  // ③ 2 : 비/눈
  // ④ 3 : 눈/비
  // ⑤ 4 : 눈
  switch (skyInfoStr) {
    //맑음
    case '10':
      className = dayTimeYn ? 'wi wi-day-sunny' : 'wi wi-night-clear';
      weatherInfoName = '맑음';
      break;

    case '20':
      className = dayTimeYn ? 'wi wi-day-cloudy' : 'wi wi-night-alt-cloudy';
      weatherInfoName = '구름 적음';
      break;
    case '21':
      className = dayTimeYn ? 'wi wi-day-rain' : 'wi wi-night-alt-rain';
      weatherInfoName = '구름 적고 비';
      break;
    case '22':
      className = dayTimeYn ? 'wi wi-day-sleet' : 'wi wi-night-alt-sleet';
      weatherInfoName = '구름 적고 비 또는 눈';
      break;
    case '23':
      className = dayTimeYn ? 'wi wi-day-sleet' : 'wi wi-night-alt-sleet';
      weatherInfoName = '구름 적고 눈 또는 비';
      break;
    case '24':
      className = dayTimeYn ? 'wi wi-day-snow' : 'wi wi-night-alt-snow';
      weatherInfoName = '구름 적고 눈';
      break;

    case '30':
      className = dayTimeYn ? 'wi wi-cloud' : 'wi wi-night-alt-cloudy';
      weatherInfoName = '구름 많음';
      break;
    case '31':
      className = dayTimeYn ? 'wi wi-rain' : 'wi wi-night-alt-rain';
      weatherInfoName = '구름 많고 비';
      break;
    case '32':
      className = dayTimeYn ? 'wi wi-sleet' : 'wi wi-night-alt-sleet';
      weatherInfoName = '구름 많고 비 또는 눈';
      break;
    case '33':
      className = dayTimeYn ? 'wi wi-sleet' : 'wi wi-night-alt-sleet';
      weatherInfoName = '구름 많고 눈 또는 비';
      break;
    case '34':
      className = dayTimeYn ? 'wi wi-snow' : 'wi wi-night-alt-snow';
      weatherInfoName = '구름 많고 눈 ';
      break;

    case '40':
      className = dayTimeYn ? 'wi wi-cloudy' : 'wi wi-night-alt-cloudy';
      weatherInfoName = '흐림';
      break;
    case '41':
      className = dayTimeYn ? 'wi wi-rain' : 'wi wi-night-alt-rain';
      weatherInfoName = '흐리고 비';
      break;
    case '42':
      className = dayTimeYn ? 'wi wi-sleet' : 'wi wi-night-alt-sleet';
      weatherInfoName = '흐리고 비 또는 눈';
      break;
    case '43':
      className = dayTimeYn ? 'wi wi-sleet' : 'wi wi-night-alt-sleet';
      weatherInfoName = '흐리고 눈 또는 비';
      break;
    case '44':
      className = dayTimeYn ? 'wi wi-snow' : 'wi wi-night-alt-snow';
      weatherInfoName = '흐리고 눈';
      break;

    default:
      break;
  }
  //---------weather code

  // 10 맑음  wi-day-sunny
  //-- 존재 불가
  // 11  맑음 비
  // 12  맑은 비/눈
  // 13  맑은 눈/비
  // 14  맑은 눈

  // 20 구름조금    wi-day-cloudy
  // 21  구름조금 비   wi-day-rain
  // 22  구름조금 비/눈 wi-day-sleet
  // 23  구름조금 눈/비   wi-day-sleet
  // 24  구름조금 눈  wi-day-snow

  // 30 구름많음 wi-cloud
  // 31  구름많음 비  wi-rain
  // 32  구름많음 비/눈 wi-sleet
  // 33  구름많음 눈/비  wi-sleet
  // 34  구름많음 눈   wi-snow

  // 40  흐림 wi-cloudy
  // 41  흐림 비  wi-rain
  // 42  흐림 비/눈  wi-sleet
  // 43  흐림 눈/비   wi-sleet
  // 44  흐림 눈  wi-snow
  return { weatherClassName: className, weatherInfoName };
};
