// @flow
import { colors } from '@atlaskit/theme';
import type { Author, Quote, QuoteMap, Terms } from './types';

import finnImg from './media/finn-min.png';
import bmoImg from './media/bmo-min.png';
import princessImg from './media/princess-min.png';
import jakeImg from './media/jake-min.png';

const jake: Author = {
  id: '1',
  name: 'Jake',
  url: 'http://adventuretime.wikia.com/wiki/Jake',
  avatarUrl: jakeImg,
  colors: {
    soft: colors.Y50,
    hard: colors.N400A,
  },
};

const BMO: Author = {
  id: '2',
  name: 'BMO',
  url: 'http://adventuretime.wikia.com/wiki/BMO',
  avatarUrl: bmoImg,
  colors: {
    soft: colors.G50,
    hard: colors.N400A,
  },
};

const finn: Author = {
  id: '3',
  name: 'Finn',
  url: 'http://adventuretime.wikia.com/wiki/Finn',
  avatarUrl: finnImg,
  colors: {
    soft: colors.B50,
    hard: colors.N400A,
  },
};

const princess: Author = {
  id: '4',
  name: 'Princess bubblegum',
  url: 'http://adventuretime.wikia.com/wiki/Princess_Bubblegum',
  avatarUrl: princessImg,
  colors: {
    soft: colors.P50,
    hard: colors.N400A,
  },
};

export const authors: Author[] = [jake, BMO, finn, princess];

export const quotes: Quote[] = [
  {
    id: '1',
    content: '1',
    author: BMO,
  },
  {
    id: '2',
    content: '2',
    author: jake,
  },
  {
    id: '3',
    content: '3',
    author: jake,
  },
  {
    id: '4',
    content: '4',
    author: finn,
  },
  {
    id: '5',
    content: '5',
    author: finn,
  },
  // {
  //   id: '6',
  //   content: 'Responsibility demands sacrifice',
  //   author: princess,
  // },
  // {
  //   id: '7',
  //   content: "That's it! The answer was so simple, I was too smart to see it!",
  //   author: princess,
  // },
  // {
  //   id: '8',
  //   content:
  //     "People make mistakes. It's all a part of growing up and you never really stop growing",
  //   author: finn,
  // },
  // {
  //   id: '9',
  //   content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
  //   author: finn,
  // },
  // {
  //   id: '10',
  //   content: 'I should not have drunk that much tea!',
  //   author: princess,
  // },
  // {
  //   id: '11',
  //   content: 'Please! I need the real you!',
  //   author: princess,
  // },
  // {
  //   id: '12',
  //   content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
  //   author: princess,
  // },
];

export const quotesTemp: Quote[] = [
  {
    id: '2',
    content: '2',
    author: jake,
  },
  {
    id: '3',
    content: '3',
    author: jake,
  },
  {
    id: '1',
    content: '1',
    author: BMO,
  },

  {
    id: '4',
    content: '4',
    author: finn,
  },
  {
    id: '5',
    content: '5',
    author: finn,
  },
  // {
  //   id: '6',
  //   content: 'Responsibility demands sacrifice',
  //   author: princess,
  // },
  // {
  //   id: '7',
  //   content: "That's it! The answer was so simple, I was too smart to see it!",
  //   author: princess,
  // },
  // {
  //   id: '8',
  //   content:
  //     "People make mistakes. It's all a part of growing up and you never really stop growing",
  //   author: finn,
  // },
  // {
  //   id: '9',
  //   content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
  //   author: finn,
  // },
  // {
  //   id: '10',
  //   content: 'I should not have drunk that much tea!',
  //   author: princess,
  // },
  // {
  //   id: '11',
  //   content: 'Please! I need the real you!',
  //   author: princess,
  // },
  // {
  //   id: '12',
  //   content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
  //   author: princess,
  // },
];
export const quotesTempNew: Quote[] = [
  {
    id: '7',
    content: '7',
    author: jake,
  },
  {
    id: '3',
    content: '3',
    author: jake,
  },
  {
    id: '1',
    content: '1',
    author: BMO,
  },

  {
    id: '4',
    content: '4',
    author: finn,
  },
  {
    id: '6',
    content: '6',
    author: finn,
  },
];

export const realTiemSearchTerms: Terms[] = [
  {
    id: '뮤직브로',
    content: '뮤직브로',
    relatedSearchTerms: '',
  },
  {
    id: '헤드레스트',
    content: '헤드레스트',
    relatedSearchTerms: '',
  },
  {
    id: '이목원',
    content: '이목원',
    relatedSearchTerms: '',
  },

  {
    id: '써니',
    content: '써니',
    relatedSearchTerms: '',
  },
  {
    id: '서경 대학교',
    content: '서경 대학교',
    relatedSearchTerms: '',
  },
  {
    id: '신촌 코로나',
    content: '신촌 코로나',
    relatedSearchTerms: '',
  },
  {
    id: '이인영',
    content: '이인영',
    relatedSearchTerms: '',
  },
  {
    id: '황우석',
    content: '황우석',
    relatedSearchTerms: '',
  },
  {
    id: '김포 조정지역 ',
    content: '김포 조정지역',
    relatedSearchTerms: '조정지역, 부동산 조정대상지역, 부산 조정지역',
  },
  {
    id: '재재',
    content: '재재',
    relatedSearchTerms: '',
  },
];
export const realTiemSearchTermsNew: Terms[] = [
  {
    id: '써니',
    content: '써니',
    relatedSearchTerms: '',
  },
  {
    id: '서경 대학교',
    content: '서경 대학교',
    relatedSearchTerms: '',
  },
  {
    id: '신촌 코로나',
    content: '신촌 코로나',
    relatedSearchTerms: '',
  },
  {
    id: '뮤직브로',
    content: '뮤직브로',
    relatedSearchTerms: '',
  },
  {
    id: '헤드레스트',
    content: '헤드레스트',
    relatedSearchTerms: '',
  },
  {
    id: '이목원',
    content: '이목원',
    relatedSearchTerms: '',
  },
  {
    id: '이인영',
    content: '이인영',
    relatedSearchTerms: '',
  },
  {
    id: '황우석',
    content: '황우석',
    relatedSearchTerms: '',
  },
  {
    id: '김포 조정지역 ',
    content: '김포 조정지역',
    relatedSearchTerms: '조정지역, 부동산 조정대상지역, 부산 조정지역',
  },
  {
    id: '재재',
    content: '재재',
    relatedSearchTerms: '',
  },
];

// So we do not have any clashes with our hardcoded ones
let idCount: number = quotes.length + 1;

export const getQuotesRandom = (count: number): Quote[] =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random: Quote = quotes[Math.floor(Math.random() * quotes.length)];

    const custom: Quote = {
      ...random,
      id: `G${idCount++}`,
    };

    return custom;
  });

export const getTerms = (count: number, isTemp: boolean): Terms[] =>
  Array.from({ length: count }, (v, k) => k).map((value, key) => {
    //const quote: Quote = isTemp ? quotesTemp[key] : quotes[key];
    const quote: Terms = isTemp
      ? realTiemSearchTermsNew[key]
      : realTiemSearchTerms[key];
    const custom: Terms = {
      ...quote,
      id: `G${quote.id}`,
    };

    return custom;
  });

export const getTerm = (): Terms => {
  const random: Terms =
    realTiemSearchTerms[Math.floor(Math.random() * realTiemSearchTerms.length)];
  const custom: Terms = {
    ...random,
    id: `G${random.id}`,
  };
  return custom;
};

export const getQuotes = (count: number, isTemp: boolean): Quote[] =>
  Array.from({ length: count }, (v, k) => k).map((value, key) => {
    //const quote: Quote = isTemp ? quotesTemp[key] : quotes[key];
    const quote: Quote = isTemp ? quotesTempNew[key] : quotes[key];
    const custom: Quote = {
      ...quote,
      id: `G${quote.id}`,
    };

    return custom;
  });

export const getQuote = (): Quote => {
  const random: Quote = quotes[Math.floor(Math.random() * quotes.length)];
  const custom: Quote = {
    ...random,
    id: `G${random.id}`,
  };
  return custom;
};

export const getAuthors = (count: number): Author[] =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random: Author = authors[Math.floor(Math.random() * authors.length)];

    const custom: Author = {
      ...random,
      id: `author-${idCount++}`,
    };

    return custom;
  });

const getByAuthor = (author: Author, items: Quote[]): Quote[] =>
  items.filter((quote: Quote) => quote.author === author);

export const authorQuoteMap: QuoteMap = authors.reduce(
  (previous: QuoteMap, author: Author) => ({
    ...previous,
    [author.name]: getByAuthor(author, quotes),
  }),
  {},
);

export const generateQuoteMap = (quoteCount: number): QuoteMap =>
  authors.reduce(
    (previous: QuoteMap, author: Author) => ({
      ...previous,
      [author.name]: getQuotes(quoteCount / authors.length, false),
    }),
    {},
  );
