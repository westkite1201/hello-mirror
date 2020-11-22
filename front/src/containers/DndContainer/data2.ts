// // @flow
// import { colors } from '@atlaskit/theme';
//import type { Author, Quote, QuoteMap } from './types';
import { Terms } from '../../lib/api/weather';
// import finnImg from './media/finn-min.png';
// import bmoImg from './media/bmo-min.png';
// import princessImg from './media/princess-min.png';
// import jakeImg from './media/jake-min.png';

// const jake: Author = {
//   keyword: '1',
//   name: 'Jake',
//   url: 'http://adventuretime.wikia.com/wiki/Jake',
//   avatarUrl: jakeImg,
//   colors: {
//     soft: colors.Y50,
//     hard: colors.N400A,
//   },
// };

// const BMO: Author = {
//   keyword: '2',
//   name: 'BMO',
//   url: 'http://adventuretime.wikia.com/wiki/BMO',
//   avatarUrl: bmoImg,
//   colors: {
//     soft: colors.G50,
//     hard: colors.N400A,
//   },
// };

// const finn: Author = {
//   keyword: '3',
//   name: 'Finn',
//   url: 'http://adventuretime.wikia.com/wiki/Finn',
//   avatarUrl: finnImg,
//   colors: {
//     soft: colors.B50,
//     hard: colors.N400A,
//   },
// };

// const princess: Author = {
//   keyword: '4',
//   name: 'Princess bubblegum',
//   url: 'http://adventuretime.wikia.com/wiki/Princess_Bubblegum',
//   avatarUrl: princessImg,
//   colors: {
//     soft: colors.P50,
//     hard: colors.N400A,
//   },
// };

//export const authors: Author[] = [jake, BMO, finn, princess];

export const realTiemSearchTerms: Terms[] = [
  {
    keyword: '뮤직브로',
    rank: 1,
    keywordSynonyms: [],
  },
  {
    keyword: '헤드레스트',
    rank: 2,
    keywordSynonyms: [],
  },
  {
    keyword: '이목원',
    rank: 3,
    keywordSynonyms: [],
  },

  {
    keyword: '써니',
    rank: 4,
    keywordSynonyms: [],
  },
  {
    keyword: '서경 대학교',
    rank: 5,
    keywordSynonyms: [],
  },
  {
    keyword: '신촌 코로나',
    rank: 6,
    keywordSynonyms: [],
  },
  {
    keyword: '이인영',
    rank: 7,
    keywordSynonyms: [],
  },
  {
    keyword: '황우석',
    rank: 8,
    keywordSynonyms: [],
  },
  {
    keyword: '김포 조정지역 ',
    rank: 9,
    keywordSynonyms: ['조정지역', '부동산 조정대상지역', '부산 조정지역'],
  },
  {
    keyword: '재재',
    rank: 10,
    keywordSynonyms: [],
  },
];
export const realTiemSearchTermsNew: Terms[] = [
  {
    keyword: '써니',
    rank: 1,
    keywordSynonyms: [],
  },
  {
    keyword: '서경 대학교',
    rank: 2,
    keywordSynonyms: [],
  },
  {
    keyword: '신촌 코로나',
    rank: 3,
    keywordSynonyms: [],
  },
  {
    keyword: '뮤직브로',
    rank: 4,
    keywordSynonyms: [],
  },
  {
    keyword: '헤드레스트',
    rank: 5,
    keywordSynonyms: [],
  },
  {
    keyword: '이목원',
    rank: 6,
    keywordSynonyms: [],
  },
  {
    keyword: '이인영',
    rank: 7,
    keywordSynonyms: [],
  },
  {
    keyword: '황우석',
    rank: 8,
    keywordSynonyms: [],
  },
  {
    keyword: '김포 조정지역 ',
    rank: 9,
    keywordSynonyms: ['조정지역', '부동산 조정대상지역', '부산 조정지역'],
  },
  {
    keyword: '재재',
    rank: 10,
    keywordSynonyms: [],
  },
];

// So we do not have any clashes with our hardcoded ones
//let idCount: number = quotes.length + 1;

// export const getQuotesRandom = (count: number): Quote[] =>
//   Array.from({ length: count }, (v, k) => k).map(() => {
//     const random: Quote = quotes[Math.floor(Math.random() * quotes.length)];

//     const custom: Quote = {
//       ...random,
//       keyword: `G${idCount++}`,
//     };

//     return custom;
//   });

export const getTerms = (count: number, isTemp: boolean): Terms[] =>
  Array.from({ length: count }, (v, k) => k).map((value, key) => {
    //const quote: Quote = isTemp ? quotesTemp[key] : quotes[key];
    const quote: Terms = isTemp
      ? realTiemSearchTermsNew[key]
      : realTiemSearchTerms[key];
    const custom: Terms = {
      ...quote,
      keyword: `G${quote.keyword}`,
    };

    return custom;
  });

export const getTerm = (): Terms => {
  const random: Terms =
    realTiemSearchTerms[Math.floor(Math.random() * realTiemSearchTerms.length)];
  const custom: Terms = {
    ...random,
    keyword: `G${random.keyword}`,
  };
  return custom;
};

// export const getQuotes = (count: number, isTemp: boolean): Quote[] =>
//   Array.from({ length: count }, (v, k) => k).map((value, key) => {
//     //const quote: Quote = isTemp ? quotesTemp[key] : quotes[key];
//     const quote: Quote = isTemp ? quotesTempNew[key] : quotes[key];
//     const custom: Quote = {
//       ...quote,
//       keyword: `G${quote.keyword}`,
//     };

//     return custom;
//   });

// export const getQuote = (): Quote => {
//   const random: Quote = quotes[Math.floor(Math.random() * quotes.length)];
//   const custom: Quote = {
//     ...random,
//     keyword: `G${random.keyword}`,
//   };
//   return custom;
// };

// export const getAuthors = (count: number): Author[] =>
//   Array.from({ length: count }, (v, k) => k).map(() => {
//     const random: Author = authors[Math.floor(Math.random() * authors.length)];

//     const custom: Author = {
//       ...random,
//       keyword: `author-${idCount++}`,
//     };

//     return custom;
//   });

// const getByAuthor = (author: Author, items: Quote[]): Quote[] =>
//   items.filter((quote: Quote) => quote.author === author);

// export const authorQuoteMap: QuoteMap = authors.reduce(
//   (previous: QuoteMap, author: Author) => ({
//     ...previous,
//     [author.name]: getByAuthor(author, quotes),
//   }),
//   {},
// );

// export const generateQuoteMap = (quoteCount: number): QuoteMap =>
//   authors.reduce(
//     (previous: QuoteMap, author: Author) => ({
//       ...previous,
//       [author.name]: getQuotes(quoteCount / authors.length, false),
//     }),
//     {},
//   );
