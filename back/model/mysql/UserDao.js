const dbHelpers = require("./mysqlHelpersPromise");

const getBookmarkBackground = async parameter => {
  try {
    const mem_idx = parameter.memIdx;
    const connection = await dbHelpers.pool.getConnection(async conn => conn);
    try {
      /* Step 3. */
      let sql = `SELECT *
				FROM SETTING_BACKGROUND
                WHERE MEM_IDX = ?`;

      const [rows] = await connection.query(sql, [mem_idx]);

      await connection.commit(); // COMMIT
      connection.release();

      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log("Query Error");
      return false;
    }
  } catch (err) {
    console.log("DB Error");
    return false;
  }
};

const saveBookmarkBackgroud = async parameter => {
  let bookmarkItemList = parameter.bookmarkItemList;
  console.log("bookmarkItemList ", bookmarkItemList);
  try {
    const connection = await dbHelpers.pool.getConnection(async conn => conn);
    try {
      /* Step 3. */
      let sql = `REPLACE INTO SETTING_BACKGROUND(MEM_IDX, ID, PAGE_URL, PREVIEW_URL, LARGE_IMAGE_URL ,TAGS, LIKES, FAVORITES, VIEWS)
            VALUES ?`;

      //await connection.beginTransaction(); // START TRANSACTION
      const [truncateRows] = await connection.query(
        `TRUNCATE SETTING_BACKGROUND`
      );
      const [bookmarkRows] = await connection.query(sql, [bookmarkItemList]);
      // select bookmarkbackground
      //await [rows] =
      const [
        rows
      ] = await connection.query(
        `SELECT * FROM SETTING_BACKGROUND WHERE MEM_IDX = ?`,
        [1]
      );
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();
      console.log("success QueryInserting and selecting  ");
      return rows;
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      console.log("Query Error");
      return false;
    }
  } catch (err) {
    console.log("DB Error");
    return false;
  }
};

module.exports = {
  saveBookmarkBackgroud: saveBookmarkBackgroud,
  getBookmarkBackground: getBookmarkBackground
};
