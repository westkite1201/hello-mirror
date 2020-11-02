import axios from 'axios';
import { clientConfig } from '../../configuration/clientConfig';
export interface Quote {
  font_color: string;
  thumbnail_user_image: string;
  thumbnail_background_image: string;
  accepted: string;
  insert_time: Date;
  update_time: Date;
  status: string;
  card_exps_typ_cd: string;
  _id: string;
  name: string;
  word: string;
  __v: number;
}
export interface QuoteResData {
  quotes_array: Quote[];
  total_count: number;
}

export interface QuotseRes {
  result: string;
  message: string;
  data: QuoteResData;
}

export interface IRequest {
  message: string;
}
export interface IError {
  message: string;
}

export interface WeatherRes {
  dataType: string;
  items: WeatherItem[];
  pageNo: number;
  numOfRows: number;
  totalCount: number;
}

export interface WeatherItem {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: number;
  ny: number;
  obsrValue: string;
}
interface shortTermType {
  nx: string;
  ny: string;
  shortTermYn: boolean;
}

/* api 이용 */
export async function getWeatherDataPrivateMode(payload: shortTermType) {
  return axios.post<WeatherRes>(
    clientConfig.endpoint.api + '/weather/getWeatherDataPrivateMode',
    payload,
  );
}

// export async function updateQuote(quote: Quote) {
//   //   const data = {
//   const response = await axios.post<QuotseRes>(
//     `${clientConfig.endpoint.api}/hangang/update_quotes_name_word`,
//     quote,
//   );
//   console.log('updateQuote updateQuote  ', response.data.data);
//   return response.data.data; // 데이터 값을 바로 반환하도록 처리합니다.
// }

// export async function getQuotes(params) {
//   const response = await axios.post<QuotseRes>(
//     `${clientConfig.endpoint.api}/hangang/word_data`,
//     params,
//   );
//   return response.data.data; // 데이터 값을 바로 반환하도록 처리합니다.
// }

export const getBackgroundImageUrl = () => {
  return axios.post(clientConfig.endpoint.api + '/file/getBackgroundImageUrl');
};

export const getAreaRiseSetInfo = () => {
  const data = {
    location: '서울',
  };
  return axios.post(
    clientConfig.endpoint.api + '/weather/getAreaRiseSetInfo',
    data,
  );
};

export const getNearbyMsrstnList = (tmX, tmY) => {
  console.log('getNearbyMsrstnList');
  const data = {
    tmX: tmX,
    tmY: tmY,
  };
  return axios.post(
    clientConfig.endpoint.api + '/weather/getNearbyMsrstnList',
    data,
  );
};

export const getLocation = (locationA, locationB, locationC) => {
  const data = {
    LOCATION_A: locationA,
    LOCATION_B: locationB,
    LOCATION_C: locationC,
  };
  return axios.post(
    clientConfig.endpoint.api + '/weather/getLocation_chain',
    data,
  );
  //return (axios.post("http://localhost:3031/api/member/test",data));
};

/* db 조회용 */
export const getWeatherData = (nx, ny, category) => {
  const data = {
    nx: nx,
    ny: ny,
    category: category,
  };
  return axios.post(
    clientConfig.endpoint.api + '/weather/getWeatherData',
    data,
  );
  //return (axios.post("http://localhost:3031/api/member/test",data));
};

export const getWeatherDataShortTerm = (nx, ny) => {
  const data = {
    nx: nx,
    ny: ny,
  };
  return axios.post(
    clientConfig.endpoint.api + '/weather/getWeatherDataShortTerm',
    data,
  );
};
