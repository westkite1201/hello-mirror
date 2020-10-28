const _ = require('lodash');

let countdown = 1000;
let countDownArr = [];
let IntervalArrayList = [];

let socketIdList = []; //현재 소켓 id가 속한 roomList를 반환
let idList = []; //  id에 속한 room 리스트를 반환
let roomList = [];

setCountDown = (room, countDown) => {
  console.log('setCountDown! ', countDownArr[room]);
  if (_.isNil(countDownArr[room])) {
    //없는 경우 세팅 다시
    countDownArr[room] = countDown;
  }
  console.log('countDownArr', countDownArr);
};

let count = 0;
const connection = (io) => {
  let timeInterval = '';
  let weatherInterval = '';
  let timeNsp = io.of('/time'); // timer 네임 스페이스 생성
  // namespace /timer 에 접속한다.
  let time = timeNsp.on('connection', function (socket) {
    console.log('timerSocketConnection');

    socket.emit('connect', {
      message: 'connection success',
      status: 200,
    });

    socket.on('updateWeatherData', function (data) {
      //clearInterval(weatherInterval);
      console.log('updateWeatherData');
      weatherInterval = setInterval(function () {
        time.emit('updateWeatherData', {
          message: 'success',
          status: 200,
        });
      }, 1000 * 3600);
    });
    //타이머 테스트
    socket.on('time', function (data) {
      clearInterval(timeInterval);
      //console.log("time!", timeInterval)
      timeInterval = setInterval(function () {
        //console.log("INTERVAL")
        count += 1;
        let serverTime = new Date();
        let year = serverTime.getFullYear();
        let month = serverTime.getMonth() + 1;
        let day = serverTime.getDate();
        let hour = serverTime.getHours();
        let minute = serverTime.getMinutes();
        let second = serverTime.getSeconds();
        let timeObj = {
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: second,
        };

        time.emit('getTime', {
          message: 'success',
          status: 200,
          serverTime: timeObj,
          count: count,
        });
      }, 1000);
      //timerStart(timer,room);
    });

    socket.on('disconnect', function (data) {
      console.log('socket disconnect');
      clearInterval(timeInterval);
      socket.disconnect();
    });

    socket.on('getTime', function (data) {
      console.log('socket.id ', socket.id);
      console.log('message from client: ', data);
      console.log(socket.room);
      //let serverTime = new date.now();
      let serverTime = new Date();
      data.serverTime = serverTime;
      console.log('data ', data);
      nsp.emit('time', data);
    });
  });
};
module.exports = {
  connection: connection,
};
