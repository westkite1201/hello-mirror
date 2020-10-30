var express = require('express');
var router = express.Router();
const weatherDao = require('../../model/mysql/weatherDao');
const weatherDaoNew = require('../../model/mysql/weatherDaoNew');
const async = require('async');
const CallSeverApi = require('./CallSeverApi')('weather');
const CallSeverApiDust = require('./CallSeverApi')('dust');
const CallSeverApiRiseSet = require('./CallSeverApi')('riseSet');
const CallSeverApiPixabay = require('./CallSeverApi')('pixabay');

const moment = require('moment');

let newtime = 0;
let newdate = 0;

let defaultLocationList = [
  { nx: 60, ny: 125, location: '서울특별시 관악구 낙성대동' }
];

convert = (xx, yy) => {
  //console.log("[SEO] [CONVERT] " ,xx , yy )
  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)

  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)

  // LCC DFS 좌표변환 ( code :
  //          "toXY"(위경도->좌표, v1:위도, v2:경도),
  //          "toLL"(좌표->위경도,v1:x, v2:y) )
  //
  function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    var rs = {};
    if (code == 'toXY') {
      rs['lat'] = v1;
      rs['lng'] = v2;
      var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
      ra = (re * sf) / Math.pow(ra, sn);
      var theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
      rs['x'] = v1;
      rs['y'] = v2;
      var xn = v1 - XO;
      var yn = ro - v2 + YO;
      ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) {
        ra = -ra;
      }
      var alat = Math.pow((re * sf) / ra, 1.0 / sn);
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      if (Math.abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (Math.abs(yn) <= 0.0) {
          theta = Math.PI * 0.5;
          if (xn < 0.0) {
            theta = -theta;
          }
        } else theta = Math.atan2(xn, yn);
      }
      var alon = theta / sn + olon;
      rs['lat'] = alat * RADDEG;
      rs['lng'] = alon * RADDEG;
    }
    return new Promise((resolve, reject) => {
      resolve(rs);
    });
  }

  var rs = dfs_xy_conv('toXY', xx, yy);
  //console.log(rs)

  return rs;
};

/* settingLocation   */
router.post('/settingLocation', async (req, res) => {
  try {
    const data = {
      settingLocationArray: req.body.settingLocationArray
    };
    console.log('settingLocation data ', data);
    let rows = await weatherDaoNew.settingLocation(data); // LOCATION 정보 XX,YY
    if (rows) {
      //온경우
      settingWeatherData();
      return res.json(rows);
    } else {
      return res.json({ message: 'error', status: 400 });
    }
  } catch (e) {
    console.log('error', e);
  }
});

router.post('/getSettingLocation', async (req, res) => {
  try {
    let rows = await weatherDaoNew.getSettingLocation(); // LOCATION 정보 XX,YY
    if (rows) {
      //온경우
      return res.json(rows);
    } else {
      console.log('error');
    }
  } catch (e) {
    console.log('error', e);
  }
});

/* shortTerm은 간격이 짧음  */
getNowTimeForShortTerm = () => {
  let date = new Date();
  let hourMinute = parseInt(moment(date).format('HHMM'));
  console.log(hourMinute);
  if (0 <= hourMinute && hourMinute < 230) {
    //하루전날
    newdate = moment(date).subtract(1, 'days').format('YYYYMMDD');
    newtime = '2300';
  } else {
    //현재 시간이 30분전이면
    if (moment(date).format('MM') <= 30) {
      newdate = moment(date).format('YYYYMMDD');
      newtime = moment(date).subtract(1, 'hour').format('HH') + '30';
      console.log('30 분전이면 ', newtime);
    } else {
      //크면
      newdate = moment(date).format('YYYYMMDD');
      newtime = moment(date).format('HH') + '00';
      console.log('30 분 후면 ', newtime);
    }
  }
};

getNowTime = () => {
  let date = new Date();
  let hourMinute = parseInt(moment(date).format('HHMM'));
  console.log('hourMinute ', hourMinute);
  if (0 <= hourMinute && hourMinute < 230) {
    //하루전날 no
    newdate = moment(date).subtract(1, 'days').format('YYYYMMDD');
    newtime = '2300';
  } else if (230 <= hourMinute && hourMinute < 530) {
    newdate = moment(date).format('YYYYMMDD');
    newtime = '0200';
  } else if (530 <= hourMinute && hourMinute < 830) {
    newdate = moment(date).format('YYYYMMDD');
    newtime = '0500';
  } else if (830 <= hourMinute && hourMinute < 1130) {
    newdate = moment(date).format('YYYYMMDD');
    newtime = '0800';
  } else if (1130 <= hourMinute && hourMinute < 1430) {
    newdate = moment(date).format('YYYYMMDD');
    newtime = '1100';
  } else if (1430 <= hourMinute && hourMinute < 1730) {
    newdate = moment(date).format('YYYYMMDD');
    newtime = '1400';
  } else if (1730 <= hourMinute && hourMinute < 2030) {
    newdate = moment(date).format('YYYYMMDD');
    newtime = '1700';
  } else if (2030 <= hourMinute && hourMinute < 2330) {
    newdate = moment(date).format('YYYYMMDD');
    newtime = '2000';
  }

  console.log(newdate, newtime);
};

isDayTime = (sunSet) => {
  console.log("moment().format('HHmm') ", moment().format('HHmm'));
  console.log('sunSet', sunSet.replace(/(\s*)/g, ''));
  sunSet = sunSet.replace(/(\s*)/g, '');

  if (sunSet > moment().format('HHmm')) {
    return true;
  } else {
    return false;
  }
};

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
        statusCode: 400
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
      locdate
    );
    isDayTimeYn = isDayTime(response.data.response.body.items.item.sunset);
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

getWeatherData = async (res, nx, ny) => {
  //nx, ny는 디비에서 가져오기
  //base_date오늘 날짜
  //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
  let base_date, base_time, type;
  base_date = newdate;
  base_time = newtime;
  type = 'json';

  await CallSeverApi.weather(
    base_date,
    base_time,
    nx,
    ny,
    type,
    (err, result) => {
      if (!err) {
        // console.log('in getWeatherData' , result)
        //return result
        res.json(result);
      } else {
        console.log(err);
      }
    }
  );
};

/* db에서 weather shortTerm data 조회  */
router.post('/getWeatherDataShortTerm', async (req, res) => {
  try {
    const data = {
      nx: req.body.nx,
      ny: req.body.ny,
      category: req.body.category
    };
    console.log('getWeatherDataShortTerm', data);
    let rows = await weatherDaoNew.getWeatherDataShortTerm(data); // LOCATION 정보 XX,YY
    if (rows && rows.length !== 0) {
      //온경우
      console.log('return data ', rows);
      return res.json(rows);
    } else {
      let insertYn = await insertWeatherDataShortTerm(data.nx, data.ny);
      if (insertYn && insertYn.status === 200) {
        let reRows = await weatherDaoNew.getWeatherDataShortTerm(data); // LOCATION 정보 XX,YY
        return res.json(reRows);
      } else {
        console.log('error');
        return res.json({ message: '재 조회 실패', status: 400, error: e });
      }
    }
  } catch (e) {
    return res.json({ message: e, status: 400, error: e });
    console.log('error', e);
  }
});

/* db에서 weather data 조회  */
router.post('/getWeatherData', async (req, res) => {
  try {
    const data = {
      nx: req.body.nx,
      ny: req.body.ny,
      category: req.body.category
    };
    console.log('[getWeatherData] ', data);
    let rows = await weatherDaoNew.getWeatherData(data); // LOCATION 정보 XX,YY
    if (rows && rows.length !== 0) {
      //온경우
      //console.log('return data ', rows);
      return res.json(rows);
    } else {
      let insertYn = await insertWeatherData(data.nx, data.ny);
      if (insertYn && insertYn.status === 200) {
        let reRows = await weatherDaoNew.getWeatherData(data); // LOCATION 정보 XX,YY
        return res.json(reRows);
      } else {
        console.log('error');
        return res.json({ message: '재 조회 실패', status: 400, error: e });
      }
    }
  } catch (e) {
    return res.json({ message: e, status: 400, error: e });
  }
});

/* api에서 조회  */
router.post('/getWeatherDataPrivateMode', async (req, res) => {
  try {
    //console.log('newdate', newdate, ' newTime', newtime);
    getNowTime();
    //nx, ny는 디비에서 가져오기
    //base_date오늘 날짜
    //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
    let base_date, base_time, type, nx, ny, shortTermYn;
    base_date = newdate;
    base_time = newtimegetWeatherData;
    type = 'json';
    shortTermYn = req.body.shortTermYn;
    nx = req.body.nx;
    ny = req.body.ny;
    //console.log(nx, ny, shortTermYn);
    let response = await CallSeverApi.weatherAsync(
      base_date,
      base_time,
      nx,
      ny,
      type,
      shortTermYn
    );
    //console.log('resposne ', response);
    if (response.message !== 'error') {
      //온경우
      return res.json(response);
    } else {
      console.log('error');
    }
  } catch (e) {
    console.log('error', e);
  }
});

insertWeatherData = async (nx, ny) => {
  //console.log('hello insertWeatherData');
  getNowTime();
  //nx, ny는 디비에서 가져오기
  //base_date오늘 날짜
  //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
  let base_date, base_time, type, shortTermYn;
  base_date = newdate;
  base_time = newtime;
  type = 'json';
  shortTermYn = false;
  //console.log('nx ', nx, ' ny ', ny);
  //nx =60, ny =125
  try {
    let result = await CallSeverApi.weatherAsync(
      base_date,
      base_time,
      nx,
      ny,
      type,
      shortTermYn
    );
    //console.log("result", result.data.response.body.items.item )
    let list = result.data.response.body.items.item.map((item) => {
      return [
        item.fcstDate,
        item.fcstTime,
        item.category,
        item.fcstValue,
        item.nx,
        item.ny,
        item.baseDate,
        item.baseTime
      ];
    });
    //console.log("list", list);
    let rows = await weatherDaoNew.insertWeatherData(list);
    //console.log('weatherDaoNew insertWeatherData ', rows);
    return new Promise((resolve, reject) => {
      resolve({ message: 'success', status: 200 });
    });
  } catch (e) {
    console.log('error ', e);
  }
};

insertWeatherDataShortTerm = async (nx, ny) => {
  console.log('insertWeatherDataShortTerm!');
  getNowTimeForShortTerm();
  //nx, ny는 디비에서 가져오기
  //base_date오늘 날짜
  //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
  let base_date, base_time, type, shortTermYn;
  base_date = newdate;
  base_time = newtime;
  type = 'json';
  shortTermYn = true;
  console.log(nx, ny);
  try {
    let result = await CallSeverApi.weatherAsync(
      base_date,
      base_time,
      nx,
      ny,
      type,
      shortTermYn
    );
    //console.log("result " , result.data.response.body.items)
    let list = result.data.response.body.items.item.map((item) => {
      return [
        item.fcstDate,
        item.fcstTime,
        item.category,
        item.fcstValue,
        item.nx,
        item.ny,
        item.baseDate,
        item.baseTime
      ];
    });

    let rows = await weatherDaoNew.insertWeatherDataShortTerm(list);
    //console.log('success', rows);
    return new Promise((resolve, reject) => {
      resolve();
    });
  } catch (e) {
    console.log('error ', e);
  }
};
insertWeatherDataShortTermLive = async (nx, ny) => {
  //console.log('insertWeatherDataShortTermLive!');
  getNowTimeForShortTerm();
  //nx, ny는 디비에서 가져오기
  //base_date오늘 날짜
  //이 정보는 디비에서 글고 여기 함수에서 계산되는거임
  let base_date, base_time, type, shortTermYn;
  base_date = newdate;
  base_time = newtime;
  type = 'json';
  shortTermYn = true;
  shortTermLiveYn = true;
  console.log(nx, ny);
  try {
    let result = await CallSeverApi.weatherAsync(
      base_date,
      base_time,
      nx,
      ny,
      type,
      shortTermYn,
      shortTermLiveYn
    );
    //console.log("result " , result.data.response.body.items)
    let list = result.data.response.body.items.item.map((item) => {
      return [item.category, item.baseDate, item.baseTime, item.nx, item.ny];
    });

    let rows = await weatherDaoNew.insertWeatherDataShortTermLive(list);
    //console.log('success', rows);
    return new Promise((resolve, reject) => {
      resolve();
    });
  } catch (e) {
    console.log('error ', e);
  }
};

// /* 이거를 crontab으로 할지   */
// settingWeatherData = async () => {
//   //console.log(Minutes + " " + second)
//   try {
//     let rows = await weatherDaoNew.getSettingLocation(); // LOCATION 정보 XX,YY
//     console.log('settingWeatherData !');
//     if (rows) {
//       //온경우
//       const convertList = await Promise.all(
//         rows.map((item, key) => {
//           return (convertXY = convert(item.Y, item.X));
//         })
//       );

//       for (const item of convertList) {
//         await insertWeatherData(item.x, item.y);
//         await insertWeatherDataShortTerm(item.x, item.y);
//         await insertWeatherDataShortTermLive(item.x, item.y);
//       }
//     } else {
//       console.log('error');
//     }
//     setInterval(() => {
//       //그냥 매 정시 마다 실행 시키도록 함
//       let d = new Date();
//       // d.getTime()
//       // d.getHours()
//       let minutes = d.getMinutes();
//       let second = d.getSeconds();
//       //console.log(minutes + ' ' + second);
//       if (minutes === 0 && second === 0) {
//         //매 정시
//         defaultLocationList.map((item) => {
//           insertWeatherDataShortTermLive(item.nx, item.ny);
//           insertWeatherDataShortTerm(item.nx, item.ny);
//           insertWeatherData(item.nx, item.ny);
//         });
//       }
//     }, 1000);
//   } catch (e) {
//     console.log('error', e);
//   }
// };

// settingWeatherData();

/* 디비 조회하기  */
router.post('/dbtest', async (req, res) => {
  try {
    let rows = await weatherDaoTest.dbTest();
    if (rows) {
      //console.log(rows)
      return res.json(rows);
    } else {
      console.log('error');
    }
  } catch (e) {
    console.log('error', e);
  }
});
//서버에서 모두 처리
// 이슈사항...AWAIT 으로 어떻게 이쁘게 받지.?ㅜㅜ
router.post('/getLocation_chain', async (req, res) => {
  await getNowTime(); //현재 시간 세팅
  try {
    const data = {
      LOCATION_A: req.body.LOCATION_A,
      LOCATION_B: req.body.LOCATION_B,
      LOCATION_C: req.body.LOCATION_C
    };
    //console.log(data)
    let rows = await weatherDaoNew.getLocation(data); // LOCATION 정보 XX,YY

    if (rows) {
      //온경우
      let nx = rows[0].X;
      let ny = rows[0].Y;
      let response = await getWeatherData(res, nx, ny); // getwehaterDATA
      //console.log('response' , response)
      //console.log('getWeatherData 완료')
      //return res.json(response)
    } else {
      console.log('error');
    }
  } catch (e) {
    console.log('error', e);
  }
});

router.post('/getLocation', async (req, res) => {
  console.log('getLocation!!');
  const data = {
    LOCATION_A: req.body.LOCATION_A,
    LOCATION_B: req.body.LOCATION_B,
    LOCATION_C: req.body.LOCATION_C
  };
  try {
    async.waterfall(
      [
        (cb) => {
          weatherDao.connect(cb);
        },
        (conn, cb) => {
          weatherDao.getLocation(conn, data, cb);
        }
      ],
      (error, conn, result) => {
        if (conn) {
          weatherDao.release(conn);
        }
        if (error) {
          return res.json({
            error: error
          });
        } else {
          return res.json(result);
        }
      }
    );
  } catch (error) {
    console.error(error);
    return res.json({
      message: 'fail',
      code: 200,
      error: error
    });
  }
});

module.exports = router;
