// // @flow
import { Terms } from '../../lib/api/weather';

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

export const realTiemSearchTermsConcatRemoveTest: Terms[] = [
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
    keyword: '추가1',
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
    keyword: '추가2',
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

export const getTerms = (count: number, isTemp: boolean): Terms[] =>
  Array.from({ length: count }, (v, k) => k).map((value, key) => {
    //const quote: Quote = isTemp ? quotesTemp[key] : quotes[key];
    const quote: Terms = isTemp
      ? realTiemSearchTermsConcatRemoveTest[key]
      : realTiemSearchTerms[key];
    const custom: Terms = {
      ...quote,
      keyword: `${quote.keyword}`,
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
