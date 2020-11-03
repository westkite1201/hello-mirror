var express = require('express');
var router = express.Router();
const userRedis = require('../../model/redis/redisDao');

statusCodeErrorHandlerAsync = (statusCode, data, noNeedParse) => {
  try {
    if (noNeedParse) {
      switch (statusCode) {
        case 200:
          return { message: 'success', data: data };
        default:
          return { message: 'error', data: data };
      }
    } else {
      switch (statusCode) {
        case 200:
          return { message: 'success', data: JSON.parse(data) };
        default:
          return { message: 'error', data: JSON.parse(data) };
      }
    }
  } catch (e) {
    console.log(e);
  }
};

router.post('/setUserBackground', async (req, res) => {
  try {
    const userId = req.body.userId;
    const backgroundURL = req.body.backgroundURL;
    await userRedis.setUserBackground({
      userId: userId,
      backgroundURL: backgroundURL
    });

    return res.json({
      message: 'success',
      api: 'setUserComponents',
      code: 200
    });
  } catch (error) {
    console.log('error', error);
    return statusCodeErrorHandlerAsync(400, error, false);
  }
});
/* 백그라운드 가져오기  */
router.post('/getUserBackground', async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log('userId ', userId);
    let backgroundURL = await userRedis.getUserBackGround({
      userId: userId
    });
    console.log('[getUserBackGround] back ', backgroundURL);
    return res.json({
      message: 'success',
      backgroundURL: backgroundURL
    });
  } catch (error) {
    console.log('error ', error);
    return res.json({ message: 'error' });
  }
});

router.post('/set_user_components', async (req, res) => {
  try {
    const userId = req.body.user_id;
    const pageName = req.body.page_name;
    const componentList = req.body.component_list;

    await userRedis.deleteUserComponent({
      user_id: userId,
      page_name: pageName
    });

    await userRedis.setUserComponents({
      user_id: userId,
      page_name: pageName,
      component_list: componentList
    });

    return res.json({
      message: 'success',
      api: 'setUserComponents',
      code: 200
    });
  } catch (error) {
    console.error(error);
    return res.json({
      message: 'fail',
      api: 'setUserComponents',
      code: 400,
      error: error
    });
  }
});

router.post('/get_user_components', async (req, res) => {
  try {
    const userId = req.body.user_id;
    const pageName = req.body.page_name;

    const componentList = await userRedis.getUserComponents({
      user_id: userId,
      page_name: pageName
    });

    return res.json({
      message: 'success',
      api: 'getUserComponents',
      code: 200,
      component_list: componentList
    });
  } catch (error) {
    console.error(error);
    return res.json({
      message: 'fail',
      api: 'getUserComponents',
      code: 400,
      error: error
    });
  }
});

module.exports = router;
