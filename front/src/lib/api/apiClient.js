import axios from 'axios';

const host =
  process.env.NODE_ENV === 'development'
    ? '/'
    : process.env.REACT_APP_API_HOST || '/';
const apiClient = axios.create({
  baseURL: host,
  withCredentials: true
});

export default apiClient;

// Something like this should work:

// function makeRequestCreator() {
//     var call;
//     return function(url) {
//         if (call) {
//             call.cancel();
//         }
//         call = axios.CancelToken.source();
//         return axios.get(url, { cancelToken: call.token }).then((response) => {
//             console.log(response.title)
//         }).catch(function(thrown) {
//             if (axios.isCancel(thrown)) {
//                 console.log('First request canceled', thrown.message);
//             } else {
//                 // handle error
//             }
//         });
//     }
// }
// You then use it with

//  var get = makeRequestCreator();
//  get('someurl');

//  Each new request will cancel the previous one
