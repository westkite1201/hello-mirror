const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
/* shortTerm은 간격이 짧음  */
const getNowTimeForShortTerm = () => {
  let newtime = 0;
  let newdate = 0;
  let date = new Date();
  let hourMinute = parseInt(moment(date).format("HHMM"));
  console.log(hourMinute);
  if (0 <= hourMinute && hourMinute < 230) {
    //하루전날
    newdate = moment(date).subtract(1, "days").format("YYYYMMDD");
    newtime = "2300";
  } else {
    //현재 시간이 30분전이면
    if (moment(date).format("MM") <= 30) {
      newdate = moment(date).format("YYYYMMDD");
      newtime = moment(date).subtract(1, "hour").format("HH") + "30";
      console.log("30 분전이면 ", newtime);
    } else {
      //크면
      newdate = moment(date).format("YYYYMMDD");
      newtime = moment(date).format("HH") + "00";
      console.log("30 분 후면 ", newtime);
    }
  }
  return {
    newdate: newdate,
    newtime: newtime,
  };
};

const getNowTime = () => {
  let newtime = 0;
  let newdate = 0;
  let date = new Date();
  let hourMinute = parseInt(moment(date).format("HHMM"));
  console.log("hourMinute ", hourMinute);
  if (0 <= hourMinute && hourMinute < 230) {
    //하루전날 no
    newdate = moment(date).subtract(1, "days").format("YYYYMMDD");
    newtime = "2300";
  } else if (230 <= hourMinute && hourMinute < 530) {
    newdate = moment(date).format("YYYYMMDD");
    newtime = "0200";
  } else if (530 <= hourMinute && hourMinute < 830) {
    newdate = moment(date).format("YYYYMMDD");
    newtime = "0500";
  } else if (830 <= hourMinute && hourMinute < 1130) {
    newdate = moment(date).format("YYYYMMDD");
    newtime = "0800";
  } else if (1130 <= hourMinute && hourMinute < 1430) {
    newdate = moment(date).format("YYYYMMDD");
    newtime = "1100";
  } else if (1430 <= hourMinute && hourMinute < 1730) {
    newdate = moment(date).format("YYYYMMDD");
    newtime = "1400";
  } else if (1730 <= hourMinute && hourMinute < 2030) {
    newdate = moment(date).format("YYYYMMDD");
    newtime = "1700";
  } else if (2030 <= hourMinute && hourMinute < 2330) {
    newdate = moment(date).format("YYYYMMDD");
    newtime = "2000";
  }

  console.log(newdate, newtime);
  return {
    newdate: newdate,
    newtime: newtime,
  };
};

const isDayTime = (sunSet) => {
  console.log("moment().format('HHmm') ", moment().format("HHmm"));
  console.log("sunSet", sunSet.replace(/(\s*)/g, ""));
  sunSet = sunSet.replace(/(\s*)/g, "");

  if (sunSet > moment().format("HHmm")) {
    return true;
  } else {
    return false;
  }
};

const convert = (xx, yy) => {
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
    if (code == "toXY") {
      rs["lat"] = v1;
      rs["lng"] = v2;
      var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
      ra = (re * sf) / Math.pow(ra, sn);
      var theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
      rs["x"] = v1;
      rs["y"] = v2;
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
      rs["lat"] = alat * RADDEG;
      rs["lng"] = alon * RADDEG;
    }
    return new Promise((resolve, reject) => {
      resolve(rs);
    });
  }

  var rs = dfs_xy_conv("toXY", xx, yy);
  //console.log(rs)

  return rs;
};

module.exports = {
  getNowTimeForShortTerm: getNowTimeForShortTerm,
  getNowTime: getNowTime,
  isDayTime: isDayTime,
  convert: convert,
};
