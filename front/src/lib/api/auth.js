//import axios from './apiClient';
import axios from 'axios';
import cilentConfig from '../../configuration/clientConfig';

export async function loginHangang(payload) {
  //   const data = {
  //
  //   };
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/auth/login`,
    payload
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}
export async function signUpHangang(payload) {
  //   const data = {
  //
  //   };
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/auth/login`,
    payload
  );
  return response.data; // 데이터 값을 바로 반환하도록 처리합니다.
}
export async function snsLoginHangang(payload) {
  const response = await axios.post(
    `${cilentConfig.endpoint.api}/auth/sns-login`,
    payload
  )
  return response.data
}
export async function logoutHangang(payload) {  // 로그아웃 시 SNS 로그아웃까지 가능하도록? 아니면 현재 페이지에 대해서만 로그아웃하도록?
  const { type } = payload
  switch (type) {
    case 'GOOGLE':
      
      break;
    case 'KAKAO':
      break;
    default:
      break;
  }

  return true;
}