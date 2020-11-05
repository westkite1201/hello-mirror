const _ = require('lodash');
const request = require('request');
const querystring = require('querystring');
function doRequest(option) {
  return new Promise(function (resolve, reject) {
    request(option, (err, res, result) => {
      try {
        if (_.isNil(res)) {
          reject(err);
        }
        if (!res) {
          reject(err);
        }
        if (_.isNil(res.statusCode)) {
          reject(err);
        }
        let statusCode = res.statusCode ? res.statusCode : 400;
        response = statusCodeErrorHandlerAsync(statusCode, result);
        if (response.message !== 'error') {
          resolve(response);
        } else {
          reject(err);
        }
      } catch (e) {
        reject(err);
      }
    });
  });
}

module.exports = function (callee) {
  function CallSeverApi(callee) {
    //console.log(callee)
    var OPTIONS = {
      url: null,
      qs: null,
      method: 'GET',
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
    };
    const PORT = '3500';

    //const BASE_PATH = '/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?';
    //VilageFcstInfoService/getVilageFcst
    const BASE_PATH = '/1360000/VilageFcstInfoService/getVilageFcst?';
    // const BASE_PATH_SHORT_TERM =
    //   '/service/SecndSrtpdFrcstInfoService2/ForecastTimeData?';
    const BASE_PATH_SHORT_TERM =
      '/1360000/VilageFcstInfoService/getUltraSrtFcst?';
    const BASE_PATH_SHORT_TERM_LIVE =
      '/1360000/VilageFcstInfoService/getUltraSrtNcst?';
    const BASE_PATH_GET_DUST_INFO =
      '/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?';
    const BASE_PATH_NEAR_STATION =
      '/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?';
    const BASE_PATH_RIST_SET =
      '/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo?';
    const BASE_PATH_PIXABAY = '/api/?';

    var HOST = null;
    (function () {
      switch (callee) {
        case 'weather':
          //HOST = 'http://newsky2.kma.go.kr';
          HOST = 'http://apis.data.go.kr';
          break;
        case 'dust':
          HOST = 'http://openapi.airkorea.or.kr';
          break;
        case 'prod':
          HOST = 'https://prod-api.com';
          break;
        case 'riseSet':
          HOST = 'http://apis.data.go.kr';
          break;
        case 'pixabay':
          HOST = 'https://pixabay.com';
          break;
        default:
          HOST = 'http://localhost';
      }
    })(callee);
    return {
      pixabay: async (query, imageType) => {
        OPTIONS.url = HOST + BASE_PATH_PIXABAY;
        let serviceKey = process.env.pixabayApiKey + '&';

        let propertiesObject = querystring.stringify({
          q: query,
          image_type: imageType
        });

        OPTIONS.url += 'key=' + serviceKey;
        OPTIONS.url += propertiesObject;
        console.log('[seo] option,url', OPTIONS.url);
        let res = await doRequest(OPTIONS);
        //console.log("response " , res)
        return res;
      },
      weatherAsync: async (
        base_date,
        base_time,
        nx,
        ny,
        type,
        shortTermYn,
        shortTermLiveYn,
        callback
      ) => {
        //console.log("shortTermYn " , (shortTermYn) )
        if (shortTermYn === 'true' || shortTermYn) {
          //console.log('tq');
          let path = shortTermLiveYn
            ? BASE_PATH_SHORT_TERM_LIVE
            : BASE_PATH_SHORT_TERM;
          OPTIONS.url = HOST + path;
        } else {
          OPTIONS.url = HOST + BASE_PATH;
        }

        //console.log('#################!!!!!!!!!!!! nx,ny', nx, ny);
        //서비스 키에 요상한 값이 있어서 계속 안됌 그래서 그냥 붙히는 걸로 함 ^^;
        let serviceKey = process.env.DATA_GO_API_KEY + '&';

        let propertiesObject = querystring.stringify({
          base_date: base_date,
          base_time: base_time,
          nx: nx,
          ny: ny,
          numOfRows: 175,
          dataType: type
        });

        OPTIONS.url += 'ServiceKey=' + serviceKey;
        OPTIONS.url += propertiesObject;
        let res = await doRequest(OPTIONS);
        //console.log("response " , res)
        return res;
      },
      getDustNearStation: async (tmX, tmY) => {
        const request = require('request');
        const querystring = require('querystring');
        OPTIONS.url = HOST + BASE_PATH_NEAR_STATION;
        //서비스 키에 요상한 값이 있어서 계속 안됌 그래서 그냥 붙히는 걸로 함 ^^;
        let serviceKey = process.env.DATA_GO_API_KEY + '&';
        let propertiesObject = querystring.stringify({
          tmX: tmX,
          tmY: tmY,
          _returnType: 'json'
        });
        OPTIONS.url += 'ServiceKey=' + serviceKey;
        OPTIONS.url += propertiesObject;
        //console.log(OPTIONS)

        let response;

        let res = await doRequest(OPTIONS);
        //console.log("response " , res)
        return res;
      },

      getDustInfo: async (stationName) => {
        OPTIONS.url = HOST + BASE_PATH_GET_DUST_INFO;
        //서비스 키에 요상한 값이 있어서 계속 안됌 그래서 그냥 붙히는 걸로 함 ^^;
        let serviceKey = process.env.DATA_GO_API_KEY + '&';
        console.log('stationName', stationName);
        let propertiesObject = querystring.stringify({
          stationName: stationName,
          dataTerm: 'DAILY',
          pageNo: 1,
          numOfRows: 1,
          ver: 1.3,
          _returnType: 'json'
        });

        propertiesObject = querystring.unescape(propertiesObject);
        OPTIONS.url += propertiesObject;
        OPTIONS.url = encodeURI(OPTIONS.url);
        //console.log(OPTIONS)
        OPTIONS.url += '&ServiceKey=' + serviceKey;

        //console.log( OPTIONS.url)

        //async를 위해 request 함수 선언

        let res = await doRequest(OPTIONS);
        return res;
      },

      getAreaRiseSetInfo: async (location, locDate) => {
        OPTIONS.url = HOST + BASE_PATH_RIST_SET;
        //서비스 키에 요상한 값이 있어서 계속 안됌 그래서 그냥 붙히는 걸로 함 ^^;
        //공개 위험
        //let serviceKey = apiConfig.apiKey.datagoApiKey + '&';
        let serviceKey = process.env.DATA_GO_API_KEY + '&';
        let propertiesObject = querystring.stringify({
          location: location,
          locdate: locDate,
          _type: 'json'
        });

        propertiesObject = querystring.unescape(propertiesObject);
        OPTIONS.url += propertiesObject;
        OPTIONS.url = encodeURI(OPTIONS.url);
        //console.log(OPTIONS)
        OPTIONS.url += '&ServiceKey=' + serviceKey;

        let res = await doRequest(OPTIONS);
        return res;
      }
    };
  }

  statusCodeErrorHandlerAsync = (statusCode, data) => {
    try {
      switch (statusCode) {
        case 200:
          return { message: 'success', data: JSON.parse(data) };
        default:
          return { message: 'error', data: JSON.parse(data) };
      }
    } catch (e) {
      console.log(e);
    }
  };

  var INSTANCE;
  if (INSTANCE === undefined) {
    INSTANCE = new CallSeverApi(callee);
  }
  return INSTANCE;
};
