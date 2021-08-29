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
  items: WeatherItem[] | WeatherShortItem[];
  pageNo: number;
  numOfRows: number;
  totalCount: number;
}

export interface WeatherShortItem {
  [x: string]: string;
  baseDate: string;
  baseTime: string;
  category: string;
  obsrValue: string;
  nx: any;
  ny: any;
}

export interface WeatherItem {
  baseDate?: string;
  baseTime?: string;
  category?: string;
  fcstDate?: string;
  fcstTime?: string;
  nx?: number;
  ny?: number;
  fcstValue?: string;
}

export interface WeatherRequestPayloadType {
  nx: string;
  ny: string;
  isShortTeamYn: boolean;
}
export interface TermsRank {
  keyword: string;
  rank: number;
  rankChange: number;
  keywordSynonyms: string[];
}
export interface Terms {
  keyword: string;
  rank: number;
  keywordSynonyms: string[];
  gap?: number;
}

export interface Ranks {
  ts: string;
  sm: string;
  data: Terms[];
  message: string;
}
export interface NewsEnterRanks {
  newsTopic: Terms[];
  enterTopic: Terms[];
  sm: string;
  ts: string;
  message: string;
}
export interface Weights {
  marketingCode: string;
  newsCode: string;
  entertainmentCode: string;
  sportsCode: string;
}
export interface RealtimeTermsRes {
  datetime: Date;
  weights: Weights;
  ranks: Ranks;
  statusCode: number;
  returnCode: number;
  message: string;
  ageCode: string;
  groupingLevelCode: string;
}
export interface NewsEnterTermsRes {
  ranks: NewsEnterRanks;
  statusCode: number;
  message: string;
}
export interface RealtimeTermsPayload {
  isUsingTemp: boolean;
}
export async function getNewsEnterTerms() {
  const res = await axios.post<NewsEnterTermsRes>(
    `${clientConfig.endpoint.api}/weather/getNewsEnterTopic`,
  );
  return res.data;
  //}
}

export async function getRealtimeTerms(payload: RealtimeTermsPayload) {
  const res = await axios.post<RealtimeTermsRes>(
    `${clientConfig.endpoint.api}/weather/getRealtimeTerms`,
  );
  return res.data;
  //}
}

/* api 이용 */
export async function getWeatherDataPrivateMode(
  payload: WeatherRequestPayloadType,
) {
  const res = await axios.post<WeatherRes>(
    `${clientConfig.endpoint.api}/weather/getWeatherDataPrivateMode`,
    payload,
  );
  return res.data;
}

/* 지금 시간 */
export async function getWeatherDataShortTermLivePrivateMode(
  payload: WeatherRequestPayloadType,
) {
  const res = await axios.post<WeatherRes>(
    `${clientConfig.endpoint.api}/weather/getWeatherDataShortTermLivePrivateMode`,
    payload,
  );
  return res.data;
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
  return axios.post(`${clientConfig.endpoint.api}/file/getBackgroundImageUrl`);
};

export const getAreaRiseSetInfo = () => {
  const data = {
    location: '서울',
  };
  return axios.post(
    `${clientConfig.endpoint.api}/weather/getAreaRiseSetInfo`,
    data,
  );
};

export const getNearbyMsrstnList = (tmX: any, tmY: any) => {
  console.log('getNearbyMsrstnList');
  const data = {
    tmX,
    tmY,
  };
  return axios.post(
    `${clientConfig.endpoint.api}/weather/getNearbyMsrstnList`,
    data,
  );
};

export const getLocation = (
  locationA: string,
  locationB: string,
  locationC: string,
) => {
  const data = {
    LOCATION_A: locationA,
    LOCATION_B: locationB,
    LOCATION_C: locationC,
  };
  return axios.post(
    `${clientConfig.endpoint.api}/weather/getLocation_chain`,
    data,
  );
  //return (axios.post("http://localhost:3031/api/member/test",data));
};

/* db 조회용 */
export const getWeatherData = (nx: any, ny: any, category: string) => {
  const data = {
    nx,
    ny,
    category,
  };
  return axios.post(
    `${clientConfig.endpoint.api}/weather/getWeatherData`,
    data,
  );
  //return (axios.post("http://localhost:3031/api/member/test",data));
};

export const getWeatherDataShortTerm = (nx: any, ny: any) => {
  const data = {
    nx,
    ny,
  };
  return axios.post(
    `${clientConfig.endpoint.api}/weather/getWeatherDataShortTerm`,
    data,
  );
};
