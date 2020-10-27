//import axios from './apiClient';
import axios from 'axios';
import cilentConfig from '../../configuration/clientConfig';
export interface HangangTemp {
  MSR_DATE: string;
  MSR_TIME: string;
  SITE_ID: string;
  W_TEMP: string;
  W_PH: string;
  W_DO: string;
  W_TN: string;
  W_TP: string;
  W_TOC: string;
  W_PHEN: string;
  W_CN: string;
}

export interface HangangTempRes {
  result: string;
  data: HangangTemp[];
}

export interface IRequest {}
export interface IError {
  message: string;
}
export async function getHangangTemp() {
  //   const data = {
  const response = await axios.get<HangangTempRes>(
    `${cilentConfig.endpoint.api}/hangang/hangang_data`
  );
  console.log("getHangangTemp response  ", response)
  return response.data.data; // 데이터 값을 바로 반환하도록 처리합니다.
}

export async function getHangangTempertureChart() {
  //   const data = {
  const response = await axios.get<HangangTemp[]>(
    `${cilentConfig.endpoint.api}/hangang/hangang_data`
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}
