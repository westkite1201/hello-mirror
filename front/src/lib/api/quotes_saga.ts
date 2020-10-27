//import axios from './apiClient';
import axios from 'axios';
import cilentConfig from '../../configuration/clientConfig';
export interface Quote {
    font_color:                 string;
    thumbnail_user_image:       string;
    thumbnail_background_image: string;
    accepted:                   string;
    insert_time:                Date;
    update_time:                Date;
    status:                     string;
    card_exps_typ_cd:           string;
    _id:                        string;
    name:                       string;
    word:                       string;
    __v:                        number;
}
export interface QuoteResData {
    quotes_array: Quote[];
    total_count:  number;
}

export interface QuotseRes {
    result:  string;
    message: string;
    data:    QuoteResData;
}

export interface IRequest {}
export interface IError {
  message: string;
}

export async function updateQuote(quote:Quote) {
  //   const data = {
  const response = await axios.post<QuotseRes>(
    `${cilentConfig.endpoint.api}/hangang/update_quotes_name_word`,quote);
  console.log("updateQuote updateQuote  ", response.data.data)
  return response.data.data; // 데이터 값을 바로 반환하도록 처리합니다.
}

export async function getQuotes(params) {
  const response = await axios.post<QuotseRes>(
    `${cilentConfig.endpoint.api}/hangang/word_data`,
    params
  );
  return response.data.data; // 데이터 값을 바로 반환하도록 처리합니다.
}
