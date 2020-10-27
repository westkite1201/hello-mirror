//import axios from './apiClient';
import axios from 'axios';
import cilentConfig from '../../configuration/clientConfig';

export async function getQuotes(params) {
  console.log(params);
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/hangang/word_data`,
    params
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}

export async function getSubmitQuotes(param) {
  const body = param;
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/hangang/word_data`,
    body
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}

export async function getQuotesAdmin() {
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/hangang/word_data_admin`
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}

export async function saveCanvasImage(param) {
  const data = {
    imgB64Data: param.imgB64Data,
    author: param.author,
    content: param.content
  };
  console.log('data ', data);
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/file/save_canvas_image`,
    data
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}

export async function updateQuotesAccepted(param) {
  const body = param;
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/hangang/update_quotes_accepted`,
    body
  );
  return response.data;
}

export async function submitQuotes(param) {
  const body = param;
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/hangang/insert_quotes`,
    body
  );
  return response.data;
}
