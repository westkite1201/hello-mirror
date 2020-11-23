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
import QuoteList from './terms-list';
import reorder from './reorder';
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

// const ArrowBox = styled.div`
//   margin-top: ${grid * 4}px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const Button = styled.button`
//   --off-white: hsla(60, 100%, 98%, 1);
//   --dark-off-white: #efefe3;
//   --darker-off-white: #d6d6cb;
//   --border-width: 4px;
//   background: var(--off-white);
//   border-radius: ${borderRadius}px;
//   cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
//   font-size: 16px;
//   position: relative;
//   box-sizing: border-box;
//   border: var(--border-width) solid var(--dark-off-white);
//   box-shadow: 0 0 0 1px var(--darker-off-white);
//   margin: 2px;
//   ::before {
//     position: absolute;
//     content: ' ';
//     top: 0;
//     right: 0;
//     bottom: 0;
//     left: 0;
//     border: 1px solid var(--dark-off-white);
//   }
//   :active {
//     border-width: 3px;
//   }
// `;

// const ArrowButton = styled(Button)`
//   width: 40px;
//   height: 40px;
// `;

// locking the height so that the border width change
// does not change the size of the button
// const ActionButton = styled(Button)`
//   height: 40px;
// `;

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
  } = props;

  const completeMoveArray = useRef<string[] | null>([]);
  const actionsRef = useRef<SnapDragActions | null>();
  const selectRef = createRef<HTMLSelectElement>();

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
    console.log('[seo] move itEM');
    for (let i = 0; i < gap; i++) {
      await timeResist();
      maybe((callbacks: SnapDragActions) =>
        isUp ? callbacks.moveUp() : callbacks.moveDown(),
      );
    }
    await timeResist();
    maybe((callbacks: SnapDragActions) => {
      actionsRef.current = null;
      callbacks.drop();
    });
  }

  //다른지 비교
  function isDifferent() {
    for (let i = 0; i < terms.length; i++) {
      if (terms[i].keyword !== termsNext[i].keyword) {
        return true;
      }
    }
    return false;
  }
  //정렬 함수
  async function moveToOrder(selectTerms, gap) {
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
  }

  async function settingLocationTerms() {
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
    //1.가장 큰 갭을 보인 친구를 먼저 움직임
    moveToOrder(selectTerms, maxGap);
    return;
  }

  async function removeItemsMoveToBottom() {
    console.log('[seo] removeItemsMoveToBottom');
    //1. remove terms 하단으로 이동
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
        const gap = terms.length - targetIndex;
        await moveItem(gap, false);
        //break;
        return;
      }
    }
    //2. removeItems 정렬이 완료되었으면 제거
    if (
      completeMoveArray.current &&
      completeMoveArray.current.length === removeTerms.length
    ) {
      //setTimeout(() => {
      removeFinal();
      completeMoveArray.current = [];
      //}, TIME_INTERVAL + 500);
    }
  }

  useEffect(() => {
    if (!isRemoved && !isAdded && removeTerms && removeTerms.length !== 0) {
      removeItemsMoveToBottom();
    }
    if (isRemoved && isAdded && isDifferent()) {
      setTimeout(() => {
        settingLocationTerms();
      }, TIME_INTERVAL);
    }
  }, [isRemoved, isAdded, removeTerms, terms]);

  return (
    <ControlBox>
      <button onClick={settingLocationTerms}>버튼 테스트 </button>
      {/*}
      <select disabled={!canLift} ref={selectRef}>
        {terms.map((quote: Terms) => (
          <option key={quote.keyword} value={quote.keyword}>
            keyword: {quote.keyword}
          </option>
        ))}
      </select>
      <ActionButton
        type="button"
        disabled={!canLift}
        onClick={() => {
          const select = selectRef.current;
          if (!select) {
            return;
          }
          actionsRef.current = lift(select.value);
        }}
      >
        Lift
        <span role="img" aria-label="lift">
          🏋️‍♀️
        </span>
      </ActionButton>
      <ActionButton
        type="button"
        onClick={() =>
          maybe((callbacks: SnapDragActions) => {
            actionsRef.current = null;
            callbacks.drop();
          })
        }
        disabled={!isDragging}
      >
        Drop{' '}
        <span role="img" aria-label="drop">
          🤾‍♂️
        </span>
      </ActionButton>
      <ArrowBox>
        <ArrowButton
          type="button"
          onClick={() =>
            maybe((callbacks: SnapDragActions) => callbacks.moveUp())
          }
          disabled={!isDragging}
        >
          ↑
        </ArrowButton>
        <div>
          <ArrowButton type="button" disabled={!isDragging}>
            ←
          </ArrowButton>
          <ArrowButton
            type="button"
            onClick={() =>
              maybe((callbacks: SnapDragActions) => callbacks.moveDown())
            }
            disabled={!isDragging} //label="down"
          >
            ↓
          </ArrowButton>
          <ArrowButton type="button" disabled={!isDragging}>
            →
          </ArrowButton>
        </div>
      </ArrowBox>
          */}
    </ControlBox>
  );
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
  const completeAddedArray = useRef<string[] | null>([]);
  //const [terms, setTerms] = useState(getTerms(10, false));
  const [termsNext, setTermsNext] = useState(getTerms(10, true));
  const [terms, setTerms] = useState(getTerms(10, false));
  // const [termsNextMap, setTernsNextMap] = useState(
  //   new Map<string, quotesMapObject>(),
  // );
  const { realtimeTerms, realtimeTermsNext } = useSelector(
    (state: RootState) => state.weather,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isControlDragging, setIsControlDragging] = useState(false);
  const sensorAPIRef = useRef<SensorAPI | null>(null);
  const dispatch = useDispatch();

  //다음 변경될 terms 세팅
  useEffect(() => {
    /* dispacth  */
    dispatch(getRealtimeTermsRequest());
  }, []);

  useEffect(() => {
    if (realtimeTerms) {
      setTerms(realtimeTerms.data);
    }
    if (realtimeTermsNext) {
      setTermsNext(realtimeTermsNext.data);
    }
  }, [realtimeTerms, realtimeTermsNext]);

  const onDragEnd = useCallback(
    function onDragEnd(result: DropResult) {
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
    //setLeftTerms([]);
  }

  useEffect(() => {
    console.log('[seo] useEffect terms!!!', terms);
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
        if (!flag) {
          setTimeout(() => {
            addTerms(concatTerms[i]);
            if (completeAddedArray && completeAddedArray.current) {
              completeAddedArray.current.push(concatTerms[i].keyword);
            }
          }, TIME_INTERVAL);
          console.log('[seo] return');
          return;
        }
      }
      setIsAdded(true);
      //}
    }
  }, [concatTerms, isRemoved, isAdded, terms]);

  function addTerms(item) {
    console.log('[seo] addQuotes!');
    setTerms([...terms, item]);
  }

  return (
    <React.Fragment>
      <button onClick={deleteItem} style={{ padding: '20px' }}>
        지우기
      </button>
      <button
        type="button"
        onClick={() => {
          setTerms([...terms, getTerm()]);
        }}
      >
        Add new item
      </button>
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
          <QuoteList listId="list" terms={terms} title="실시간 검색어" />
          <Controls
            terms={terms}
            termsNext={termsNext}
            removeTerms={removeTerms}
            removeFinal={removeFinal}
            canLift={!isDragging}
            isDragging={isControlDragging}
            isAdded={isAdded}
            isRemoved={isRemoved}
            lift={lift}
          />
        </Layout>
      </DragDropContext>
    </React.Fragment>
  );
}
