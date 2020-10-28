let express = require('express');
let router = express.Router();
const QuotesDaoNew = require('../../model/mysql/QuotesDaoNew');

/*   */
router.post('/getWisdomQuotes', async (req, res) => {
  try {
    const data = {
      pageNumber: req.body.pageNumber
    };
    console.log(data);
    //console.log(data)
    let rows = await QuotesDaoNew.getWisdomQuotes(data); //

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

router.post('/setWisdomQuotes', async (req, res) => {
  try {
    const data = {
      quotes: req.body.quotes,
      author: req.body.author
    };
    //console.log(data)
    let rows = await QuotesDaoNew.setWisdomQuotes(data); //
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

router.post('/deleteWisdomQuotes', async (req, res) => {
  try {
    const data = {
      quotesNum: req.body.quotesNum
    };

    //console.log(data)
    let rows = await QuotesDaoNew.deleteWisdomQuotes(data); //
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

router.post('/updateWisdomQuotes', async (req, res) => {
  try {
    const data = {
      quotesNum: req.body.quotesNum,
      quotes: req.body.quotes,
      author: req.body.author
    };
    //console.log(data)
    let rows = await QuotesDaoNew.updateWisdomQuotes(data); //
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

module.exports = router;
