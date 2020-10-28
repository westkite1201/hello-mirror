const dbHelpers = require('./mysqlHelpersPromise');

const numberOfItem = 5; // 몇개를 가져와 보여줄것인지
/* Step 2. get connection */
const getWisdomQuotes = async (data) => {
  try {
    const { pageNumber } = data;
    console.log(pageNumber);
    let startIndex = pageNumber * numberOfItem;
    console.log(startIndex);
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      //await connection.beginTransaction(); // START TRANSACTION
      //const [rows] = await connection.query('SELECT * FROM wisdom_quotes LIMIT ? , ?',[startIndex, numberOfItem]);
      const [rows] = await connection.query('SELECT * FROM wisdom_quotes');
      //이렇게되면 디비에서 전부 조회하기때문에 트랜잭션후 처리가 맞으나
      //애초에 많은 양은 필요없기에 이렇게 진행하도록 한다.
      let totalCount = rows.length;
      let pageCount = Math.celi(totalCount / numberOfItem);
      let resData = {
        totalCount: totalCount,
        isLast: pageCount === pageNumber ? true : false,
        rows: rows.slice(startIndex, startIndex + numberOfItem)
      };

      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      //const [rows] = await connection.query('INSERT INTO MEMBERS_INFO(ID, PW) VALUES(?, ?)', [ID, PW]);
      await connection.commit(); // COMMIT
      connection.release();
      return rows;
    } catch (err) {
      ``;
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

const setWisdomQuotes = async (data) => {
  try {
    let quotes = data.quotes;
    let author = data.author;
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      await connection.beginTransaction(); // START TRANSACTION
      const [
        insertRow
      ] = await connection.query(
        'INSERT INTO wisdom_quotes(quotes,author) VALUES (?,?)',
        [quotes, author]
      );
      const [rows] = await connection.query('SELECT * FROM wisdom_quotes');
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

const deleteWisdomQuotes = async (data) => {
  try {
    let quotesNum = data.quotesNum;
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      /* Step 3. */
      //await connection.beginTransaction(); // START TRANSACTION
      const [
        deleteRows
      ] = await connection.query(
        'DELETE FROM wisdom_quotes WHERE QUOTES_NUM = ?',
        [quotesNum]
      );
      const [rows] = await connection.query('SELECT * FROM wisdom_quotes');
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

const updateWisdomQuotes = async (data) => {
  try {
    const connection = await dbHelpers.pool.getConnection(async (conn) => conn);
    try {
      let quotesNum = data.quotesNum;
      let quotes = data.quotes;
      let author = data.author;
      /* Step 3. */
      //await connection.beginTransaction(); // START TRANSACTION
      let updateSql = `UPDATE wisdom_quotes
			SET QUOTES = ?,
				AUTHOR  = ?
			WHERE QUOTES_NUM = ? `;
      await connection.beginTransaction(); // START TRANSACTION
      const [updateRows] = await connection.query(updateSql, [
        quotes,
        author,
        quotesNum
      ]);
      const [rows] = await connection.query('SELECT * FROM wisdom_quotes');
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

module.exports = {
  getWisdomQuotes: getWisdomQuotes,
  setWisdomQuotes: setWisdomQuotes,
  deleteWisdomQuotes: deleteWisdomQuotes,
  updateWisdomQuotes: updateWisdomQuotes
};
