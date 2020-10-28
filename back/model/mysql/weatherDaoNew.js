const dbHelpers = require('./mysqlHelpersPromise');

/* Step 2. get connection */
const dbTest = async (param1, param2, param3) => {
  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      const ID = 'HELLO';
      const PW = 'WORLD';
      //await connection.beginTransaction(); // START TRANSACTION
      const [rows] = await connection.query('SELECT * FROM CQMS_MEMBER');
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();
      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return false;
    }
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};
/* 선택된 로케이션 저장  */

/**
 * 벌크 인서 트 
 * @param {
 * var sql = "INSERT INTO Test (name, email, n) VALUES ?";
var values = [
    ['demian', 'demian@gmail.com', 1],
    ['john', 'john@gmail.com', 2],
    ['mark', 'mark@gmail.com', 3],
    ['pete', 'pete@gmail.com', 4]} parameter 
 */
const settingLocation = async (parameter) => {
  try {
    const settingLocationArray = parameter.settingLocationArray;
    console.log('settingLocationArray ', settingLocationArray);
    let locationArray = [];

    for (let data of settingLocationArray) {
      let address_name = data.addressName;
      let address_type = data.addressType;
      /* INT 로 갈지 말지 정하자  */
      let x = data.x;
      let y = data.y;
      let mem_idx = 1;
      let b_code = '';
      let h_code = '';
      let main_address_no = '';
      let mountain_yn = '';
      let region_1depth_name = '';
      let region_2depth_name = '';
      let region_3depth_h_name = '';
      let region_3depth_name = '';
      let sub_address_no = '';
      //road 관련
      let road_address_name = '';
      let building_name = '';
      let main_building_no = '';
      let sub_building_no = '';
      let underground_yn = '';
      let zone_no = '';
      if (data.address) {
        b_code = data.address.b_code;
        h_code = data.address.h_code;
        main_address_no = data.address.main_address_no;
        mountain_yn = data.address.mountain_yn;
        region_1depth_name = data.address.region_1depth_name;
        region_2depth_name = data.address.region_2depth_name;
        region_3depth_h_name = data.address.region_3depth_h_name;
        region_3depth_name = data.address.region_3depth_name;
        sub_address_no = data.address.sub_address_no;
      }
      if (data.roadAddress) {
        road_address_name = data.roadAddress.address_name;
        building_name = data.roadAddress.building_name;
        main_building_no = data.roadAddress.main_building_no;
        sub_building_no = data.roadAddress.sub_building_no;
        underground_yn = data.roadAddress.underground_yn;
        zone_no = data.roadAddress.zone_no;
      }
      //locationArray.push([address_name, address_type, x, y, mem_idx]);
      locationArray.push([
        address_name,
        x,
        y,
        mem_idx,
        b_code,
        h_code,
        main_address_no,
        mountain_yn,
        region_1depth_name,
        region_2depth_name,
        region_3depth_h_name,
        region_3depth_name,
        sub_address_no,
        //load. 관련
        road_address_name,
        building_name,
        main_building_no,
        sub_building_no,
        underground_yn,
        zone_no
      ]);
    }

    console.log('settingLocationArray ', settingLocationArray);
    console.log('locationArray ', locationArray);
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    let locationRaw;
    let data = [];
    try {
      if (locationArray && locationArray.length !== 0) {
        await connection.beginTransaction(); // START TRANSACTION
        let res = await connection.query('DELETE FROM LOCATION', [
          locationArray
        ]);
        console.log('delete res ');
        // /* Step 3. */
        let sql = `REPLACE INTO LOCATION(ADDRESS_NAME,
          X,
          Y,
          MEM_IDX,
          B_CODE,
          H_CODE,
          MAIN_ADDRESS_NO,
          MOUNTAIN_YN,
          REGION_1DEPTH_NAME,
          REGION_2DEPTH_NAME,
          REGION_3DEPTH_H_NAME,
          REGION_3DEPTH_NAME,
          SUB_ADDRESS_NO,
          ROAD_ADDRESS_NAME,
          BUILDING_NAME,
          MAIN_BUILDING_NO,
          SUB_BUILDING_NO,
          UNDERGROUND_YN,
          ZONE_NO) VALUES ?`;
        const [insertRow] = await connection.query(sql, [locationArray]);

        [locationRaw] = await connection.query(`SELECT * FROM LOCATION`);

        for (let rows of locationRaw) {
          let locationItem = {
            x: rows.X,
            y: rows.Y,
            mem_idx: rows.MEM_IDX,
            address_name: rows.ADDRESS_NAME,
            address: {
              b_code: rows.B_CODE,
              h_code: rows.H_CODE,
              main_address_no: rows.MAIN_ADDRESS_NO,
              mountain_yn: rows.MOUNTAIN_YN,
              region_1depth_name: rows.REGION_1DEPTH_NAME,
              region_2depth_name: rows.REGION_2DEPTH_NAME,
              region_3depth_h_name: rows.REGION_3DEPTH_H_NAME,
              region_3depth_name: rows.REGION_3DEPTH_NAME,
              sub_address_no: rows.SUB_ADDRESS_NO
            },
            roadAddress: {
              address_name: rows.ROAD_ADDRESS_NAME,
              building_name: rows.BUILDING_NAME,
              main_building_no: rows.MAIN_BUILDING_NO,
              sub_building_no: rows.SUB_BUILDING_NO,
              underground_yn: rows.UNDERGROUND_YN,
              zone_no: rows.ZONE_NO
            }
          };
          data.push(locationItem);
        }
        // //await connection.beginTransaction(); // START TRANSACTION
        // //const [rows] = await connection.query(sql,[locationA, locationB, locationC]);
        // //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
        // //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
        await connection.commit(); // COMMIT
      }
      connection.release();
      return data;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error', err);
      return false;
    }
  } catch (err) {
    console.log('DB Error', err);
    return false;
  }
};

/*getSettingLocation */
const getSettingLocation = async () => {
  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      const [locationRaw] = await connection.query(`SELECT * FROM LOCATION`);

      let data = [];
      for (let rows of locationRaw) {
        let locatonItem = {
          x: rows.X,
          y: rows.Y,
          mem_idx: rows.MEM_IDX,
          address_name: rows.ADDRESS_NAME,
          address: {
            b_code: rows.B_CODE,
            h_code: rows.H_CODE,
            main_address_no: rows.MAIN_ADDRESS_NO,
            mountain_yn: rows.MOUNTAIN_YN,
            region_1depth_name: rows.REGION_1DEPTH_NAME,
            region_2depth_name: rows.REGION_2DEPTH_NAME,
            region_3depth_h_name: rows.REGION_3DEPTH_H_NAME,
            region_3depth_name: rows.REGION_3DEPTH_NAME,
            sub_address_no: rows.SUB_ADDRESS_NO
          },
          roadAddress: {
            address_name: rows.ROAD_ADDRESS_NAME,
            building_name: rows.BUILDING_NAME,
            main_building_no: rows.MAIN_BUILDING_NO,
            sub_building_no: rows.SUB_BUILDING_NO,
            underground_yn: rows.UNDERGROUND_YN,
            zone_no: rows.ZONE_NO
          }
        };
        data.push(locatonItem);
      }

      await connection.commit(); // COMMIT
      connection.release();

      return data;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return false;
    }
  } catch (err) {
    console.log('DB Error', err);
    return false;
  }
};

const getLocation = async (parameter) => {
  try {
    const locationA =
      parameter.LOCATION_A === '서울'
        ? parameter.LOCATION_A + '특별시'
        : parameter.LOCATION_A;
    const locationB = parameter.LOCATION_B;
    const locationC = parameter.LOCATION_C;
    // console.log(locationA)
    // console.log(locationB)
    // console.log(locationC)

    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      let sql = ` SELECT X,Y 
						FROM KOREA_LOCATION
						WHERE LOCATION_A = ? 
							AND LOCATION_B = ? 
							AND LOCATION_C = ? `;

      const [rows] = await connection.query(sql, [
        '서울특별시',
        '관악구',
        '인헌동'
      ]);

      //await connection.beginTransaction(); // START TRANSACTION
      //const [rows] = await connection.query(sql,[locationA, locationB, locationC]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();

      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return false;
    }
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};

const getWeatherData = async (parameter) => {
  try {
    const nx = parameter.nx;
    const ny = parameter.ny;
    const category = parameter.category;
    //console.log('#################', nx, ny, category);
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      let sql = '';
      if (category === 'ALL') {
        /* Step 3. */
        sql = `SELECT *
					   FROM WEATHER
						WHERE NX = ? AND NY = ?
							AND FCST_DATE >= ( SELECT date_format( now() - INTERVAL 2 DAY, '%Y%m%d') )
							AND FCST_DATE <= ( SELECT date_format( now() + INTERVAL 1 DAY, '%Y%m%d') )`;
      } else {
        /* Step 3. */
        sql = `SELECT *
					   FROM WEATHER
						WHERE NX = ? AND NY = ?
							AND CATEGORY = ?
							AND FCST_DATE >= ( SELECT date_format( now() - INTERVAL 2 DAY, '%Y%m%d') )
							AND FCST_DATE <= ( SELECT date_format( now() + INTERVAL 1 DAY, '%Y%m%d') )`;
      }
      const [rows] = await connection.query(sql, [nx, ny]);
      //const [rows] = await connection.query(sql, [nx, ny, category]);

      //await connection.beginTransaction(); // START TRANSACTION
      //const [rows] = await connection.query(sql,[locationA, locationB, locationC]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();

      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return false;
    }
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};

const getWeatherDataShortTerm = async (parameter) => {
  try {
    const nx = parameter.nx;
    const ny = parameter.ny;
    //const category = parameter.category;
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      let sql = ` 
						SELECT *
						FROM weather_short_term
						WHERE NX = ? AND NY = ?
						AND FCST_DATE = ( SELECT date_format( now(), '%Y%m%d') )
						AND FCST_TIME = ( SELECT date_format( now(), '%H00') )  `;

      const [rows] = await connection.query(sql, [nx, ny]);

      //await connection.beginTransaction(); // START TRANSACTION
      //const [rows] = await connection.query(sql,[locationA, locationB, locationC]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();

      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return false;
    }
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};

/* 현재 성공 함 */
/* WEATHER DATA REPLACE  */
const insertWeatherData = async (parameter) => {
  //console.log('dao insertWeatherData start ');
  let list = parameter;
  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      let sql = `REPLACE INTO weather(FCST_DATE, FCST_TIME,CATEGORY, FCST_VALUE, NX ,NY, BASE_DATE, BASE_TIME)
			VALUES ?`;

      const [rows] = await connection.query(sql, [list]);

      //await connection.beginTransaction(); // START TRANSACTION
      //const [rows] = await connection.query(sql,[locationA, locationB, locationC]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();
      return new Promise((resolve, reject) => {
        //console.log('return promise');
        resolve(rows);
      });
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return new Promise((resolve, reject) => {
        reject({ message: err });
      });
    }
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};
const insertWeatherDataShortTermLive = async (parameter) => {
  let list = parameter;
  //console.log('list ', list);
  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      let sql = `REPLACE INTO weather_short_term_live(CATEGORY, BASE_DATE, BASE_TIME, NX ,NY)
			VALUES ?`;
      const [rows] = await connection.query(sql, [list]);
      await connection.commit(); // COMMIT
      connection.release();
      console.log('success QueryInserting ');
      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return false;
    }
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};

const insertWeatherDataShortTerm = async (parameter) => {
  let list = parameter;
  //console.log('list ', list);
  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      let sql = `REPLACE INTO weather_short_term(FCST_DATE, FCST_TIME, CATEGORY, FCST_VALUE, NX ,NY,BASE_DATE, BASE_TIME)
			VALUES ?`;

      const [rows] = await connection.query(sql, [list]);

      //await connection.beginTransaction(); // START TRANSACTION
      //const [rows] = await connection.query(sql,[locationA, locationB, locationC]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();
      console.log('success QueryInserting ');
      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log('Query Error');
      return false;
    }
  } catch (err) {
    console.log('DB Error');
    return false;
  }
};

module.exports = {
  dbTest: dbTest,
  getLocation: getLocation,
  getWeatherData: getWeatherData,
  getWeatherDataShortTerm: getWeatherDataShortTerm,
  insertWeatherData: insertWeatherData,
  insertWeatherDataShortTerm: insertWeatherDataShortTerm,
  insertWeatherDataShortTermLive: insertWeatherDataShortTermLive,
  settingLocation: settingLocation,
  getSettingLocation: getSettingLocation
};
