var express = require('express');
var router = express.Router();
const weatherDaoNew = require('../../model/mysql/weatherDaoNew');
const CallSeverApi = require('./CallSeverApi')('weather');
const CallSeverApiDust = require('./CallSeverApi')('dust');
const CallSeverApiRiseSet = require('./CallSeverApi')('riseSet');
const CallSeverApiPixabay = require('./CallSeverApi')('pixabay');

const moment = require('moment');
const helpers = require('../../lib/helpers');

let newtime = 0;
let newdate = 0;

// /* settingLocation   */
// router.post('/settingLocation', async (req, res) => {
//   try {
//     const data = {
//       settingLocationArray: req.body.settingLocationArray
//     };
//     console.log('settingLocation data ', data);
//     let rows = await weatherDaoNew.settingLocation(data); // LOCATION 정보 XX,YY
//     if (rows) {
//       //온경우
//       settingWeatherData();
//       return res.json(rows);
//     } else {
//       return res.json({ message: 'error', status: 400 });
//     }
//   } catch (e) {
//     console.log('error', e);
//   }
// });

// router.post('/getSettingLocation', async (req, res) => {
//   try {
//     let rows = await weatherDaoNew.getSettingLocation(); // LOCATION 정보 XX,YY
//     if (rows) {
//       //온경우
//       return res.json(rows);
//     } else {
//       console.log('error');
//     }
//   } catch (e) {
//     console.log('error', e);
//   }
// });

String.prototype.replaceAll = function (org, dest) {
  return this.split(org).join(dest);
};
const FILE_ROOT_DIR = process.cwd();
router.post('/getRealtimeTerms', async (req, res) => {
  try {
    var util = require('util');
    var spawn = require('child_process').spawn;
    var process = spawn('python3', [
      FILE_ROOT_DIR + '/src/lib/python/naverRealtime.py',
    ]);
    util.log('readingin');
    process.stdout.on('data', function (chunk) {
      let textChunk = chunk.toString('utf-8'); // buffer to string
      //textChunk = a(textChunk);
      util.log(textChunk);
      textChunk = textChunk.replaceAll("'", '"');
      textChunk = textChunk.replaceAll('None', '"None"');
      const obj = JSON.parse(textChunk);
      res.json(obj);
    });
    //replaceAll prototype 선언
  } catch (e) {
    console.error(e);
  }
});

router.post('/getNewsEnterTopic', async (req, res) => {
  //console.log(req.body);
  let number = req.body.backjoonNumber;
  //console.log(number);
  try {
    var util = require('util');
    var spawn = require('child_process').spawn;
    var process = spawn('python3', [
      FILE_ROOT_DIR + '/src/lib/python/topic.py',
      number,
    ]);
    util.log('readingin');
    process.stdout.on('data', function (chunk) {
      let textChunk = chunk.toString('utf-8'); // buffer to string
      //textChunk = a(textChunk);
      util.log(textChunk);
      textChunk = textChunk.replaceAll("'", '"');
      textChunk = textChunk.replaceAll('None', '"None"');
      const obj = JSON.parse(textChunk);
      res.json(obj);
    });
    //replaceAll prototype 선언
  } catch (e) {
    console.error(e);
  }
});

router.post('/getPixabayImages', async (req, res) => {
  let query = req.body.query;
  let imageType = req.body.imageType;

  try {
    let response = await CallSeverApiPixabay.pixabay(query, imageType);
    //console.log("getPixabayImage response " , response );
    if (response.message !== 'error') {
      return res.json(response);
    } else {
      return res.json({
        message: 'error',
        statusCode: 400,
      });
    }
  } catch (e) {
    console.log('error ', e);
  }
});

router.post('/getAreaRiseSetInfo', async (req, res) => {
  console.log('getAreaRiseSetInfo!');
  let location = req.body.location;
  let locdate = moment().format('YYYYMMDD');
  //console.log(tmX, tmY)
  try {
    let response = await CallSeverApiRiseSet.getAreaRiseSetInfo(
      location,
      locdate,
    );
    isDayTimeYn = helpers.isDayTime(
      response.data.response.body.items.item.sunset,
    );
    response.data.response.body.items.item.isDayTimeYn = isDayTimeYn;
    if (response.message !== 'error') {
      res.json(response);
    }
  } catch (e) {
    console.log('error', e);
  }
});

router.post('/getNearbyMsrstnList', async (req, res) => {
  console.log('getNearbyMsrstnList!');
  let tmX = req.body.tmX;
  let tmY = req.body.tmY;

  //console.log(tmX, tmY)
  try {
    const response = await CallSeverApiDust.getDustNearStation(tmX, tmY);
    //sconsole.log(response)
    let addr = response.data.list[0].addr; //측정소 주소
    let stationName = response.data.list[0].stationName; //측정소 이름
    let distance = response.data.list[0].tm; //거리

    //console.log("addr ", addr, "stationName ", stationName," distance ",distance )
    if (response.message !== 'error') {
      const dustInfoResponse = await CallSeverApiDust.getDustInfo(stationName);
      //console.log("dustInfoResponse ", dustInfoResponse)
      if (dustInfoResponse.message !== 'error') {
        let dustInfo = dustInfoResponse.data.list[0];
        dustInfo['addr'] = addr;
        dustInfo['stationName'] = stationName;
        dustInfo['distance'] = distance;
        //console.log( dustInfoResponse.data.list[0])
        console.log('[SEO] ', dustInfo);
        res.json(dustInfo);
        // return
        // {
        //   coGrade : dustInfo.coGrade
        //   coValue: dustInfo.coValue
        //   dataTerm: dustInfo.dataTerm
        //   dataTime: dustInfo.dataTime
        //   khaiGrade: dustInfo.khaiGrade
        //   khaiValue: dustInfo.khaiValue
        //   mangName: dustInfo.mangName
        //   no2Grade: dustInfo.no2Grade
        //   no2Value: dustInfo.no2Value
        //   numOfRows: dustInfo.numOfRows
        //   o3Grade: dustInfo.o3Grade
        //   o3Value: dustInfo.o3Value
        //   pageNo: dustInfo.pageNo
        //   pm10Grade: dustInfo.pm10Grade
        //   pm10Grade1h: dustInfo.pm10Grade1h
        //   pm10Value: dustInfo.pm10Value
        //   pm10Value24: dustInfo.pm10Value24
        //   pm25Grade: dustInfo.pm25Grade
        //   pm25Grade1h: dustInfo.pm25Grade1h
        //   pm25Value: dustInfo.pm25Value
        //   pm25Value24:dustInfo.pm25Value24
        //   sidoName: dustInfo.sidoName
        //   so2Grade: dustInfo.so2Grade
        //   so2Value: dustInfoso2Value
        // }
      }
    }
  } catch (e) {
    console.log('error', e);
    return res.json({ message: e, status: 400 });
  }
});

router.post('/getWeatherDataMid', async (req, res) => {
  try {
    //console.log('newdate', newdate, ' newTime', newtime);
    let timeData = helpers.getNowTime();
    //nx, ny는 디비에서 가져오기
    //base_date오늘 날짜
    //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
    let base_date, base_time, type, nx, ny, shortTermYn, shortTermLiveYn, midYn;
    base_date = timeData.newdate;
    base_time = timeData.newtime;
    type = 'json';
    (shortTermYn = false), (shortTermLiveYn = false);
    midYn = true;
    nx = req.body.nx;
    ny = req.body.ny;
    //console.log(nx, ny, shortTermYn);
    let response = await CallSeverApi.weatherAsync(
      base_date,
      base_time,
      nx,
      ny,
      type,
      shortTermYn,
      shortTermLiveYn,
      midYn,
    );
    //console.log('resposne ', response);
    if (response.message !== 'error' && response.message === 'success') {
      //온경우
      return res.json(response.data.response.body);
    } else {
      console.log('error');
    }
  } catch (e) {
    console.log('error', e);
  }
});

/* api에서 조회  */
router.post('/getWeatherDataPrivateMode', async (req, res) => {
  try {
    //console.log('newdate', newdate, ' newTime', newtime);
    let timeData = helpers.getNowTime();
    //nx, ny는 디비에서 가져오기
    //base_date오늘 날짜
    //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
    let base_date, base_time, type, nx, ny, shortTermYn;
    base_date = timeData.newdate;
    base_time = timeData.newtime;
    type = 'json';
    shortTermYn = req.body.isShortTeamYn;
    nx = req.body.nx;
    ny = req.body.ny;
    numOfRows = req.body.numOfRows;
    console.log(nx, ny, shortTermYn, numOfRows);
    let response = await CallSeverApi.weatherAsync(
      base_date,
      base_time,
      nx,
      ny,
      type,
      shortTermYn, //short
      false, //live
      false, //mid
      numOfRows,
    );
    //console.log('resposne ', response);
    if (response.message !== 'error' && response.message === 'success') {
      //온경우
      return res.json(response.data.response.body.items.item);
    } else {
      return res.json({ message: 'error no data ', status: 400 });
    }
  } catch (e) {
    console.log('error', e);
    return res.json({ message: 'error' + e, status: 400 });
  }
});
/* api에서 조회  */
router.post('/getWeatherDataShortTermLivePrivateMode', async (req, res) => {
  console.log('getWeatherDataShortTermLivePrivateMode!');
  let timeData = helpers.getNowTimeForShortTerm();
  //nx, ny는 디비에서 가져오기
  //base_date오늘 날짜
  //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
  let base_date, base_time, type, nx, ny, shortTermYn, shortTermLiveYn;
  base_date = timeData.newdate;
  base_time = timeData.newtime;
  type = 'json';
  shortTermYn = true;
  shortTermLiveYn = true;
  nx = req.body.nx;
  ny = req.body.ny;
  console.log(
    'hello',
    base_date,
    base_time,
    nx,
    ny,
    type,
    shortTermYn,
    shortTermLiveYn,
  );
  try {
    let result = await CallSeverApi.weatherAsync(
      base_date,
      base_time,
      nx,
      ny,
      type,
      shortTermYn,
      shortTermLiveYn,
    );
    if (result.message !== 'error') {
      //온경우
      console.log(result);
      //return res.json({ test: 'dssd' });
      return res.json(result.data.response.body.items.item);
    } else {
      console.log('error');
      return res.json({ status: 404, message: 'error' });
    }
  } catch (e) {
    return res.json({ status: 404, message: e });
  }
});

// insertWeatherDataShortTermLive = async (nx, ny) => {
//   //console.log('insertWeatherDataShortTermLive!');
//   getNowTimeForShortTerm();
//   //nx, ny는 디비에서 가져오기
//   //base_date오늘 날짜
//   //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
//   let base_date, base_time, type, shortTermYn;
//   base_date = newdate;
//   base_time = newtime;
//   type = 'json';
//   shortTermYn = true;
//   shortTermLiveYn = true;
//   console.log(nx, ny);
//   try {
//     let result = await CallSeverApi.weatherAsync(
//       base_date,
//       base_time,
//       nx,
//       ny,
//       type,
//       shortTermYn,
//       shortTermLiveYn
//     );
//     //console.log("result " , result.data.response.body.items)
//     let list = result.data.response.body.items.item.map((item) => {
//       return [item.category, item.baseDate, item.baseTime, item.nx, item.ny];
//     });

//     let rows = await weatherDaoNew.insertWeatherDataShortTermLive(list);
//     //console.log('success', rows);
//     return new Promise((resolve, reject) => {
//       resolve();
//     });
//   } catch (e) {
//     console.log('error ', e);
//   }
// };

module.exports = router;
