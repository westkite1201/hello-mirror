const redishelpers = require('./redis');
const util = require('util');
const key_component_info = 'ComponentInfo';
const BACKGROUND = 'background';

const setUserBackground = (data) => {
  console.log('----- setUserBackground --------');
  const key = util.format('%s:%s', BACKGROUND, data.userId);
  console.log('key =>', key);
  return redishelpers.redis.set(key, data.backgroundURL);
};

const getUserBackGround = (data) => {
  console.log('----- getUserBackground --------');
  console.log('userId ', data.userId);
  const key = util.format('%s:%s', BACKGROUND, data.userId);
  console.log('key =>', key);
  return redishelpers.redis.get(key);
};

const setUserComponents = (data) => {
  console.log('----- setUserComponents --------');
  console.log(data);

  const key = util.format(
    '%s:%s:%s',
    key_component_info,
    data.user_id,
    data.page_name
  );
  console.log('key =>', key);
  return redishelpers.redis.sadd(key, data.component_list);
};

const getUserComponents = (data) => {
  console.log('----- getUserComponents --------');
  console.log(data);

  const key = util.format(
    '%s:%s:%s',
    key_component_info,
    data.user_id,
    data.page_name
  );
  console.log('key =>', key);
  return redishelpers.redis.smembers(key);
};

const deleteUserComponent = (data) => {
  console.log('----- deleteUserComponent --------');
  console.log(data);

  const key = util.format(
    '%s:%s:%s',
    key_component_info,
    data.user_id,
    data.page_name
  );
  console.log('key =>', key);
  return redishelpers.redis.del(key);
};

// expire test

///////////////////////////////

module.exports = {
  // keys
  getUserComponents: getUserComponents,
  setUserComponents: setUserComponents,
  deleteUserComponent: deleteUserComponent,
  setUserBackground: setUserBackground,
  getUserBackGround: getUserBackGround
};
