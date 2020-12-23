// @flow
/* eslint-disable no-console */
import React, {
  useRef,
  createRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import styled from 'styled-components';
import {
  DropResult,
  PreDragActions,
  SnapDragActions,
  SensorAPI,
  DragDropContext,
} from 'react-beautiful-dnd';
//import { getTerms, getTerm } from './data2';
import TermsList from '../../components/keyword/terms-list';
import reorder from '../../components/keyword/reorder';
import { grid } from '../../components/keyword/constants';
import { useSelector, useDispatch } from 'react-redux';
import { getRealtimeTermsRequest } from '../../store/weather/reducer';
import { Terms } from '../../lib/api/weather';
import { RootState } from '../../store/rootReducer';

type ControlProps = {
  removeTerms: Terms[];
  terms: Terms[];
  termsNext: Terms[];
  canLift: boolean;
  isDragging: boolean;
  isAdded: boolean;
  isRemoved: boolean;
  setInit: () => void;
  removeFinal: () => void;
  lift: (quoteId: string) => SnapDragActions | null;
  getRankChange: () => void;
};

function noop() {
  // do nothing.
}

const ControlBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const TIME_INTERVAL = 200;
function Controls(props: ControlProps) {
  const {
    terms,
    canLift,
    isDragging,
    lift,
    termsNext,
    removeTerms,
    removeFinal,
    isAdded,
    isRemoved,
    setInit,
    getRankChange,
  } = props;

  const completeMoveArray = useRef<string[] | null>([]);
  const actionsRef = useRef<SnapDragActions | null>();
  const selectRef = createRef<HTMLSelectElement>();
  const isMoving = useRef(false);

  function maybe(fn: (callbacks: SnapDragActions) => void) {
    if (actionsRef.current) {
      fn(actionsRef.current);
    }
  }
  //시간 지연용
  function timeResist() {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve('time resist');
      }, TIME_INTERVAL);
    });
  }
  //Move
  async function moveItem(gap: number, isUp: boolean) {
    isMoving.current = true;
    console.log('[seo] move item ', gap, isUp);
    for (let i = 0; i < gap; i++) {
      await timeResist();
      maybe((callbacks: SnapDragActions) =>
        isUp ? callbacks.moveUp() : callbacks.moveDown(),
      );
    }
    await timeResist();

    maybe((callbacks: SnapDragActions) => {
      console.log('[seo] moveItem drag drop');
      actionsRef.current = null;
      callbacks.drop();
    });
    isMoving.current = false;
    //await timeResist();
  }

  //다른지 비교
  function isDifferent() {
    for (let i = 0; i < terms.length; i++) {
      if (terms[i].keyword !== termsNext[i].keyword) {
        console.log('[seo] isDifferent true');
        return true;
      }
    }
    console.log('[seo] isNotDiffrent');
    return false;
  }
  //정렬 함수
  async function moveToOrder(selectTerms, gap) {
    console.log('[seo] moveToOrder');
    if (selectTerms) {
      const presentTermsKeyword = selectTerms.keyword;
      console.log('[seo] keyword', presentTermsKeyword, gap);
      actionsRef.current = lift(presentTermsKeyword);
      if (gap > 0) {
        await moveItem(gap, true);
        return true;
      } else {
        await moveItem(Math.abs(gap), false);
        return true;
      }
    } else {
      console.log('[seo] moveToOrder drag drop');
      maybe((callbacks: SnapDragActions) => {
        actionsRef.current = null;
        callbacks.drop();
      });
      return false;
    }
  }

  async function settingLocationTerms() {
    console.log(
      '[seo] settingLocationTerms terms',
      terms,
      ' termsNext ',
      termsNext,
    );
    let selectTerms;
    let maxGap = 0;
    //1. 가장 많이 움직이는 terms 선택
    for (let i = 0; i < terms.length; i++) {
      for (let j = 0; j < termsNext.length; j++) {
        if (terms[i].keyword === termsNext[j].keyword) {
          const gap = terms[i].rank - termsNext[j].rank;
          if (maxGap < gap) {
            maxGap = gap;
            selectTerms = terms[i];
          }
        }
      }
    }
    console.log('[seo] find! selectTerms ', selectTerms);
    //1.가장 큰 갭을 보인 친구를 먼저 움직임
    const isMove = await moveToOrder(selectTerms, maxGap);

    console.log('[seo] ismove', isMove);
    return;
  }

  async function removeItemsMoveToBottom() {
    // console.log(
    //   '[seo] removeItemsMoveToBottom completeMoveArray',
    //   completeMoveArray.current,
    //   ' removeTerms ',
    //   removeTerms,
    // );
    // //1. remove terms 하단으로 이동
    // if (!isRemoved) {
    //   for (let i = 0; i < removeTerms.length; i++) {
    //     let targetIndex = 0;
    //     if (
    //       completeMoveArray.current &&
    //       !completeMoveArray.current.includes(removeTerms[i].keyword)
    //     ) {
    //       for (let j = 0; j < terms.length; j++) {
    //         if (removeTerms[i].keyword === terms[j].keyword) {
    //           targetIndex = j;
    //           actionsRef.current = lift(removeTerms[i].keyword);
    //           completeMoveArray.current.push(removeTerms[i].keyword);
    //           break;
    //         }
    //       }
    //       console.log('[seo] targetindex', targetIndex);
    //       const gap = terms.length - targetIndex;
    //       await moveItem(gap, false);
    //       //break;
    //       return;
    //     }
    //   }
    // }
    // //2. removeItems 정렬이 완료되었으면 제거
    // if (
    //   completeMoveArray.current &&
    //   completeMoveArray.current.length === removeTerms.length &&
    //   !isRemoved &&
    //   !isMoving.current
    // ) {
    //   console.log('[seo]  2. removeItems 정렬이 완료되었으면 제거 ');
    //   setTimeout(() => {
    //     removeFinal();
    //     completeMoveArray.current = [];
    //   }, TIME_INTERVAL);
    // }
  }

  useEffect(() => {
    if (!isRemoved && !isAdded && removeTerms && removeTerms.length !== 0) {
      //removeItemsMoveToBottom();
    } else if (isRemoved && isAdded) {
      if (isDifferent()) {
        getRankChange();
        settingLocationTerms();
      } else {
        //바뀐게 없으면 초기화
        setInit();
      }
    }
  }, [isRemoved, isAdded, removeTerms, terms, termsNext]);

  return <ControlBox></ControlBox>;
}

const Layout = styled.div`
  display: flex;
  justify-content: center;
  // margin-top: ${grid * 1}px;
  // > * {
  //   margin: ${grid}px;
  // }
`;

type Props = {
  initial: Terms[];
};

export default function RealtimeTermsContainer(props: Props) {
  //const [terms, setTerms] = useState(props.initial);
  const [isReady, setIsReady] = useState(false);
  const [leftTerms, setLeftTerms] = useState<Terms[]>([]);
  const [removeTerms, setRemoveTerms] = useState<Terms[]>([]);
  const [concatTerms, setConcatTerms] = useState<Terms[]>([]);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const completeAddedSet = useRef(new Set<string>());
  const completeDeletedSet = useRef(new Set<string>());
  const [termsNext, setTermsNext] = useState<Terms[]>([]);
  const [terms, setTerms] = useState<Terms[]>([]);
  // const [termsNext, setTermsNext] = useState<Terms[]>(getTerms(10, true));
  // const [terms, setTerms] = useState<Terms[]>(getTerms(10, false));
  const { realtimeTerms, realtimeTermsNext, realtimeLoading } = useSelector(
    (state: RootState) => state.weather,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isControlDragging, setIsControlDragging] = useState(false);
  const sensorAPIRef = useRef<SensorAPI | null>(null);
  const isEnd = useRef(true);
  const rankMap = useRef(new Map<string, number>());
  const isRankMapSetComplete = useRef(false);
  const dispatch = useDispatch();

  //랭크 세팅
  function setRankTerms() {
    const newTerms = terms.map((item, index) => {
      return {
        ...item,
        rank: index + 1,
        gap: rankMap.current.get(item.keyword),
      };
    });
    setTerms(newTerms);
  }
  function setInit() {
    setRankTerms();
    // console.log(
    //   '[seo] --------$$$$$$$-------------------------------setInit!!',
    // );
    setIsRemoved(false);
    setIsAdded(false);
    setLeftTerms([]);
    setRemoveTerms([]);
    setConcatTerms([]);
    setIsReady(false);
    isEnd.current = true;
    completeAddedSet.current.clear();
    completeDeletedSet.current.clear();
    rankMap.current.clear();
    isRankMapSetComplete.current = false;
  }

  //다음 변경될 terms 세팅
  useEffect(() => {
    function dispatchTerms() {
      //loading 이 끝낫거나 정렬이 끝난경우
      if (!realtimeLoading && isEnd.current) {
        const isUsingTemp = false;
        dispatch(getRealtimeTermsRequest({ isUsingTemp }));
      }
    }
    dispatchTerms();
    /* dispacth  */
    setInterval(dispatchTerms, 1000 * 60);
  }, []);

  useEffect(() => {
    console.log('[seo] useEffect ', realtimeTerms, realtimeTermsNext);
    if (realtimeTerms) {
      setTerms(realtimeTerms.data.slice(0, 10));
    }
    if (realtimeTermsNext) {
      setTermsNext(realtimeTermsNext.data.slice(0, 10));
    }
    setIsReady(true);
    isEnd.current = false;
  }, [realtimeTerms, realtimeTermsNext]);

  useEffect(() => {
    if (!isRemoved && !isAdded && !isEnd.current && isReady) {
      //deleteItem();
      manageDelete();
    }
  }, [terms, termsNext, isRemoved, isAdded, isEnd.current, isReady]);

  const onDragEnd = useCallback(
    function onDragEnd(result: DropResult) {
      console.log('[seo] onDragEnd');
      setIsDragging(false);
      setIsControlDragging(false);
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      let newTerms = reorder(
        terms,
        result.source.index,
        result.destination.index,
      );
      console.log('[seo] newTerms', newTerms);
      newTerms = newTerms.map((item, index) => {
        return {
          ...item,
          rank: index + 1,
        };
      });
      setTerms(newTerms);
    },
    [terms],
  );

  function lift(quoteId: string) {
    if (isDragging) {
      return null;
    }

    const api = sensorAPIRef.current;

    if (!api) {
      console.warn('unable to find sensor api');
      return null;
    }

    const preDrag = api.tryGetLock(quoteId, noop);

    if (!preDrag) {
      console.log('unable to start capturing');
      return null;
    }
    setIsControlDragging(true);
    return preDrag.snapLift();
  }

  // function manageQuotes() {}

  function manageDelete() {
    const leftTerms: Terms[] = [];
    console.log('[seo] manageDelete ', terms);
    const termsRemove = terms.filter(item => {
      //중복 제거
      for (let i = 0; i < termsNext.length; i++) {
        if (termsNext[i].keyword === item.keyword) {
          leftTerms.push(Object.assign({}, item)); //남은 친구들
          return false;
        }
      }
      return true;
    });
    console.log('[seo] terms Remove ', termsRemove);

    //DELETE ITEM
    for (let i = 0; i < termsRemove.length; i++) {
      const termsRemoveItem = termsRemove[i];
      const newTerms = [...terms]; // make a separate copy of the array
      let targetIndex = -1;
      for (let j = 0; j < newTerms.length; j++) {
        if (termsRemoveItem.keyword === newTerms[j].keyword) {
          targetIndex = j;
          break;
        }
      }
      if (targetIndex !== -1) {
        setTimeout(() => {
          if (!completeDeletedSet.current.has(termsRemoveItem.keyword)) {
            completeDeletedSet.current.add(termsRemoveItem.keyword);
            newTerms.splice(targetIndex, 1);
            setTerms(newTerms);
          }
        }, TIME_INTERVAL);
        return;
      }
    }
    //alert('hello');
    setIsRemoved(true);
    completeDeletedSet.current.clear();
    const concatTerms = termsNext.filter(item => {
      //중복 제거
      for (let i = 0; i < terms.length; i++) {
        if (terms[i].keyword === item.keyword) {
          return false;
        }
      }
      return true;
    });
    //onsole.log('[seo]--------------concatTerms', concatTerms);
    setConcatTerms(concatTerms);
    if (concatTerms.length === 0) {
      setIsAdded(true);
    }
  }
  useEffect(() => {
    //console.log('[seo] useEffect terms!!!', terms, ' termsnext ', termsNext);
    // remove 종료시 concat 추가
    // add terms
    if (concatTerms && concatTerms.length !== 0 && isRemoved && !isAdded) {
      for (let i = 0; i < concatTerms.length; i++) {
        let flag = false;
        for (let j = 0; j < terms.length; j++) {
          if (concatTerms[i].keyword === terms[j].keyword) {
            flag = true;
          }
        }
        //추가될 concat일떄
        if (!flag) {
          setTimeout(() => {
            //추가된 terms가 아니면 추가
            if (!completeAddedSet.current.has(concatTerms[i].keyword)) {
              addTerms(concatTerms[i]);
              completeAddedSet.current.add(concatTerms[i].keyword);
            }
          }, TIME_INTERVAL);
          console.log('[seo] return');
          return;
        }
      }
      setIsAdded(true);
    }
  }, [concatTerms, isRemoved, isAdded, terms, termsNext]);

  function addTerms(item) {
    //console.log('[seo] addQuotes! ', item);
    const newTerms = terms.map((item, index) => {
      return {
        ...item,
        rank: index + 1,
      };
    });
    setTerms([...newTerms, item]);
  }
  function getRankChange() {
    if (!isRankMapSetComplete.current) {
      for (let i = 0; i < terms.length; i++) {
        for (let j = 0; j < termsNext.length; j++) {
          if (terms[i].keyword === termsNext[j].keyword) {
            const gap = terms[i].rank - termsNext[j].rank;
            rankMap.current.set(terms[i].keyword, gap);
            break;
          }
        }
      }
      console.log('[seo] rankmap', rankMap.current.entries());
    }
    isRankMapSetComplete.current = true;
  }

  // function deleteTerms(termsRemoveItem: Terms) {
  //   const newTerms = [...terms]; // make a separate copy of the array
  //   let targetIndex = -1;
  //   for (let j = 0; j < newTerms.length; j++) {
  //     if (termsRemoveItem.keyword === newTerms[j].keyword) {
  //       targetIndex = j;
  //     }
  //   }
  //   if (targetIndex !== -1) {
  //     if (!completeDeletedSet.current.has(termsRemoveItem.keyword)) {
  //       completeDeletedSet.current.add(termsRemoveItem.keyword);
  //       newTerms.splice(targetIndex, 1);
  //       setTerms(newTerms);
  //     }
  //     return true;
  //   }
  //   return false;
  // }

  function deleteItem() {
    // console.log(
    //   '[seo] deleteItem========== terms!!!',
    //   terms,
    //   'termsNext',
    //   termsNext,
    // );
    // const leftTerms: Terms[] = [];
    // const termsRemove = terms.filter(item => {
    //   //중복 제거
    //   for (let i = 0; i < termsNext.length; i++) {
    //     if (termsNext[i].keyword === item.keyword) {
    //       leftTerms.push(Object.assign({}, item)); //남은 친구들
    //       return false;
    //     }
    //   }
    //   return true;
    // });
    // const concatTerms = termsNext.filter(item => {
    //   //중복 제거
    //   for (let i = 0; i < terms.length; i++) {
    //     if (terms[i].keyword === item.keyword) {
    //       return false;
    //     }
    //   }
    //   return true;
    // });
    // //삭제 될게 없다면
    // if (termsRemove && termsRemove.length === 0) {
    //   setIsRemoved(true);
    // }
    // if (concatTerms && concatTerms.length === 0) {
    //   setIsAdded(true);
    // }
    // console.log('[seo] leftTerms', leftTerms);
    // console.log('[seo] termsRemove', termsRemove);
    // console.log('[seo] concatTerms', concatTerms);
    // setRemoveTerms(termsRemove); //제거할 애들
    // setLeftTerms(leftTerms.slice()); //본 quetos에 서 남은 애들
    // setConcatTerms(concatTerms);
    //setConcatQuotesMap(concatTerms);
    //remove 할 애들setConcatQuotes
    //terms 움직이기
    //remove 하기
    //추가할 애들 추가
  }

  function removeFinal() {
    // console.log('[seo] removeFinal leftTerms ', leftTerms);
    // setTerms(leftTerms);
    // setIsRemoved(true); // remove 종료 flag 세팅
    // setLeftTerms([]);
  }

  // function testUseTemp() {
  //   console.log('[seo] realtimeLoading ', realtimeLoading);
  //   if (!realtimeLoading) {
  //     const isUsingTemp = true;
  //     dispatch(getRealtimeTermsRequest({ isUsingTemp }));
  //   }
  // }
  // function testGeneral() {
  //   console.log('[seo] realtimeLoading ', realtimeLoading);
  //   if (!realtimeLoading) {
  //     const isUsingTemp = false;
  //     dispatch(getRealtimeTermsRequest({ isUsingTemp }));
  //   }
  // }
  return (
    <React.Fragment>
      {/*
      <div style={{ padding: '50px' }}></div>
      <button onClick={testUseTemp}>디스패치</button>
      <button onClick={testGeneral}>디스패치2</button>
      <button onClick={setInit}>초기화</button>
      */}
      <DragDropContext
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
        sensors={[
          api => {
            sensorAPIRef.current = api;
          },
        ]}
      >
        <Layout>
          <TermsList
            listId="list"
            terms={terms}
            title="실시간 검색어"
            sm={realtimeTermsNext.ts}
          />
          <Controls
            terms={terms}
            termsNext={termsNext}
            removeTerms={removeTerms}
            removeFinal={removeFinal}
            canLift={!isDragging}
            isDragging={isControlDragging}
            isAdded={isAdded}
            isRemoved={isRemoved}
            setInit={setInit}
            lift={lift}
            getRankChange={getRankChange}
          />
        </Layout>
      </DragDropContext>
    </React.Fragment>
  );
}
