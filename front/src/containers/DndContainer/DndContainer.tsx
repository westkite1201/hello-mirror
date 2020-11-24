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
import { getTerms, getTerm } from './data2';
import TermsList from './terms-list';
import reorder from './reorder2';
import { grid, borderRadius } from './constants';
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
    console.log(
      '[seo] removeItemsMoveToBottom completeMoveArray',
      completeMoveArray.current,
      ' removeTerms ',
      removeTerms,
    );
    //1. remove terms 하단으로 이동
    if (!isRemoved) {
      for (let i = 0; i < removeTerms.length; i++) {
        let targetIndex = 0;
        if (
          completeMoveArray.current &&
          !completeMoveArray.current.includes(removeTerms[i].keyword)
        ) {
          for (let j = 0; j < terms.length; j++) {
            if (removeTerms[i].keyword === terms[j].keyword) {
              targetIndex = j;
              actionsRef.current = lift(removeTerms[i].keyword);
              completeMoveArray.current.push(removeTerms[i].keyword);
              break;
            }
          }
          console.log('[seo] targetindex', targetIndex);
          const gap = terms.length - targetIndex;
          await moveItem(gap, false);
          //break;
          return;
        }
      }
    }

    if (completeMoveArray.current) {
      console.log(
        '[seo] completeMoveArray.current.length  ',
        completeMoveArray.current.length,
        ' removeTerms.length  ',
        removeTerms.length,
      );
    }

    //2. removeItems 정렬이 완료되었으면 제거
    if (
      completeMoveArray.current &&
      completeMoveArray.current.length === removeTerms.length &&
      !isRemoved &&
      !isMoving.current
    ) {
      console.log('[seo]  2. removeItems 정렬이 완료되었으면 제거 ');
      setTimeout(() => {
        removeFinal();
        completeMoveArray.current = [];
      }, TIME_INTERVAL);
    }
  }

  useEffect(() => {
    console.log('[seo] isRemoved', isRemoved, ' isAdded ', isAdded);
    if (!isRemoved && !isAdded && removeTerms && removeTerms.length !== 0) {
      removeItemsMoveToBottom();
    } else if (isRemoved && isAdded) {
      if (isDifferent()) {
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
  margin-top: ${grid * 4}px;
  > * {
    margin: ${grid}px;
  }
`;

type Props = {
  initial: Terms[];
};

export default function DndContainer(props: Props) {
  //const [terms, setTerms] = useState(props.initial);
  const [leftTerms, setLeftTerms] = useState<Terms[]>([]);
  const [removeTerms, setRemoveTerms] = useState<Terms[]>([]);
  const [concatTerms, setConcatTerms] = useState<Terms[]>([]);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const completeAddedSet = useRef(new Set<string>());
  const [termsNext, setTermsNext] = useState(getTerms(10, true));
  const [terms, setTerms] = useState(getTerms(10, false));
  const { realtimeTerms, realtimeTermsNext } = useSelector(
    (state: RootState) => state.weather,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isControlDragging, setIsControlDragging] = useState(false);
  const sensorAPIRef = useRef<SensorAPI | null>(null);
  const isEnd = useRef(false);
  const dispatch = useDispatch();

  function setInit() {
    console.log('[seo] setInit');
    setIsRemoved(false);
    setIsAdded(false);
    setLeftTerms([]);
    setRemoveTerms([]);
    setConcatTerms([]);
    isEnd.current = true;
    completeAddedSet.current.clear();
  }

  //다음 변경될 terms 세팅
  useEffect(() => {
    function dispatchTerms() {
      dispatch(getRealtimeTermsRequest());
      isEnd.current = false;
    }
    /* dispacth  */
    setInterval(dispatchTerms, 1000 * 60);
  }, [dispatch]);

  useEffect(() => {
    if (realtimeTerms) {
      setTerms(realtimeTerms.data);
    }
    if (realtimeTermsNext) {
      setTermsNext(realtimeTermsNext.data);
    }
  }, [realtimeTerms, realtimeTermsNext]);

  useEffect(() => {
    if (
      terms &&
      terms.length !== 0 &&
      termsNext &&
      termsNext.length !== 0 &&
      !isRemoved &&
      !isAdded &&
      !isEnd.current
    ) {
      deleteItem();
    }
  }, [terms, termsNext, isRemoved, isAdded, isEnd.current]);

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

  function deleteItem() {
    const leftTerms: Terms[] = [];
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

    const concatTerms = termsNext.filter(item => {
      //중복 제거
      for (let i = 0; i < terms.length; i++) {
        if (terms[i].keyword === item.keyword) {
          return false;
        }
      }
      return true;
    });
    //삭제 될게 없다면
    if (termsRemove && termsRemove.length === 0) {
      setIsRemoved(true);
    }
    if (concatTerms && concatTerms.length === 0) {
      setIsAdded(true);
    }
    console.log('[seo] leftTerms', leftTerms);
    console.log('[seo] termsRemove', termsRemove);
    console.log('[seo] concatTerms', concatTerms);
    setRemoveTerms(termsRemove); //제거할 애들
    setLeftTerms(leftTerms.slice()); //본 quetos에 서 남은 애들
    setConcatTerms(concatTerms);
    //setConcatQuotesMap(concatTerms);
    //remove 할 애들setConcatQuotes
    //terms 움직이기
    //remove 하기
    //추가할 애들 추가
  }
  function removeFinal() {
    console.log('[seo] removeFinal leftTerms ', leftTerms);
    setTerms(leftTerms);
    setIsRemoved(true); // remove 종료 flag 세팅
    setLeftTerms([]);
  }

  useEffect(() => {
    console.log('[seo] useEffect terms!!!', terms, ' termsnext ', termsNext);
    //remove 종료시 concat 추가
    //add terms
    if (isRemoved && !isAdded) {
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
    //}
  }, [concatTerms, isRemoved, isAdded, terms, termsNext]);

  function addTerms(item) {
    console.log('[seo] addQuotes! ', item);
    const newTerms = terms.map((item, index) => {
      return {
        ...item,
        rank: index + 1,
      };
    });
    setTerms([...newTerms, item]);
  }

  return (
    <React.Fragment>
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
          />
        </Layout>
      </DragDropContext>
    </React.Fragment>
  );
}
