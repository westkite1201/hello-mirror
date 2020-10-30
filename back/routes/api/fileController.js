const multer = require('multer');
const path = require('path');
let fs = require('fs');
let express = require('express');
let router = express.Router();
const userRedis = require('../../model/redis/redisDao');
const _ = require('lodash');

/* multiple file Upload example  */
let FILE_ROOT_DIR = process.cwd();
let FILE_FORDER_PATH = '/public/images/';
// 일지 조회 끝
let storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // console.log('dest');
    await userFilePathCheck(req);
    await destFilePathCheck(req);

    const store_dir = FILE_ROOT_DIR + FILE_FORDER_PATH + req.body.user_id;
    //'/' +
    //req.body.reg_date.substring(0, 8);
    // const store_dir = FILE_ROOT_DIR + '/' + test_user_id + "/" + test_reg_date.substring(0, 8);
    cb(null, store_dir);
  },
  filename: (req, file, cb) => {
    const store_file_name = file.originalname;
    // const store_file_name = file.originalname + '_' + test_reg_date;
    cb(null, store_file_name);
  }
});

let upload = multer({
  storage: storage
}).array('files', 10);

router.post('/uploadFiles', async (req, res, next) => {
  try {
    upload(req, res, function (err) {
      if (err) {
        return res.json({
          code: 400,
          message: 'file upload error',
          error: err
        });
      } else {
        return res.json({
          code: 100,
          message: 'file save complete'
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: 'file upload error',
      error: error
    });
  }
});

function existsAsync(path) {
  return new Promise(function (resolve) {
    fs.exists(path, resolve);
  });
}

function mkdirAsync(path) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(path, { recursive: true }, function (err) {
      if (err) {
        console.log('Error in folder creation');
        return reject(err);
      }
      return resolve(true);
    });
  });
}

// // 유저 별 파일 저장 디렉토리 확인
async function userFilePathCheck(req) {
  try {
    if (_.isEmpty(req.files)) {
      return;
    } else {
      const user_file_path =
        FILE_ROOT_DIR + FILE_FORDER_PATH + req.body.user_id;
      // const user_file_path = FILE_ROOT_DIR + '/' + test_user_id;
      /**
       * 현재 해당 아이디랑 날짜에 대한 디렉토리가 있는지 확인해볼 것.
       */
      // console.log("user_file_path ", user_file_path);
      let exist = await existsAsync(user_file_path);
      if (!exist) {
        await mkdirAsync(user_file_path);
      }
      return;
    }
  } catch (error) {
    console.log(error);
    // return res.json({
    //   code: 400,
    //   message: 'userFilePathCheck Error',
    //   error: error,
    // });
  }
}

// // 최종 저장경로 확인
async function destFilePathCheck(req) {
  try {
    if (_.isEmpty(req.files)) {
      return;
    } else {
      const dest_file_path =
        FILE_ROOT_DIR + FILE_FORDER_PATH + req.body.user_id;
      // '/' +
      // req.body.reg_date.substring(0, 8);
      // const dest_file_path = FILE_ROOT_DIR + '/' + test_user_id + '/' + test_reg_date.substring(0, 8);
      /**
       * 현재 해당 아이디랑 날짜에 대한 디렉토리가 있는지 확인해볼 것.
       */
      let exist = await existsAsync(dest_file_path);
      // console.log(exist);
      if (!exist) {
        let mkdir = await mkdirAsync(dest_file_path);
        return;
      }
      return;
    }
  } catch (error) {
    return res.json({
      code: 400,
      message: 'destFilePathCheck Error',
      error: error
    });
  }
}
// // 일지 등록 끝

// // 파일 다운로드 시작
router.get('/file-downloads', (req, res) => {
  // router.get('/downloads', (req, res) => {

  console.log('file!!!: ', req.query);

  // const file_name = req.body.file_name;
  // const file_name = req.param.file_name;
  try {
    const dest_file_path = FILE_ROOT_DIR + FILE_FORDER_PATH + req.query.user_id;
    // const dest_file_path = FILE_ROOT_DIR + '/jachoi/' + '20400220'
    const file_name = req.query.file_name;
    // const file_name = 'KakaoTalk_20400130_105558099.jpg_20400220114030'
    console.log('file!: ', dest_file_path + '/' + file_name);
    res.download(dest_file_path + '/' + file_name);
  } catch (error) {
    console.log('file error!: ', error);
    return res.json({
      code: 400,
      message: 'file download 에러',
      error: error
    });
  }
});

// 이미지파일 호스팅 로직
router.get('/image/:userId/:name', function (req, res) {
  let pathDir = FILE_ROOT_DIR + FILE_FORDER_PATH;
  let userId = req.params.userId;
  let filename = req.params.name;
  console.log('filename', pathDir + userId + '/' + filename);
  fs.exists(pathDir + userId + '/' + filename, function (exists) {
    if (exists) {
      fs.readFile(pathDir + userId + '/' + filename, function (err, data) {
        res.end(data);
      });
    } else {
      res.end('file is not exists');
    }
  });
});

//해당 디렉터리르 읽고 해당 디렉터리에 ㅣㅇㅆ는
// 파일들을 반호나

router.post('/getImageFilePath', function (req, res) {
  const store_dir = FILE_ROOT_DIR + FILE_FORDER_PATH + req.body.user_id;
  try {
    let files = fs.readdirSync(store_dir); // 디렉토리를 읽어온다
    //console.log(' files', files);
    return res.json({
      code: 200,
      message: 'success',
      data: {
        files: files
      }
    });
  } catch (e) {
    console.log('error ', e);
  }
});

//test
router.get('/getImageDownloadToUrl/:url/:id/:userId', async function (
  req,
  res
) {
  let fs = require('fs'),
    request = require('request');

  let url = req.params.url;
  let path =
    FILE_ROOT_DIR +
    FILE_FORDER_PATH +
    req.params.userId +
    '/' +
    req.params.id +
    '.jpg';
  // console.log('url', url);
  // console.log('path ', path);
  try {
    let download = function (url, path, callback) {
      request.head(url, function (err, res, body) {
        // console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);
        request(url).pipe(fs.createWriteStream(path)).on('close', callback);
      });
    };

    download(url, path, function () {
      console.log('done');
      res.json({
        message: 'success',
        status: '200'
      });
    });
  } catch (e) {
    res.json({
      message: 'error' + e,
      status: '400'
    });
  }
});
module.exports = router;
