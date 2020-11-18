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
import type { Quote } from './types';
// import type {
//   DropResult,
//   PreDragActions,
//   SnapDragActions,
//   SensorAPI,
// } from 'react-beautiful-dnd';
import {
  DropResult,
  PreDragActions,
  SnapDragActions,
  SensorAPI,
  DragDropContext,
} from 'react-beautiful-dnd';
import { getQuotes, getQuote } from './data';
import QuoteList from './quote-list';
import reorder from './reorder';
import { grid, borderRadius } from './constants';
interface quotesMapObject {
  content: Quote;
  order: number;
}
type ControlProps = {
  quotes: Quote[];
  quotesNext: Quote[];
  quotesNextMap: Map<string, quotesMapObject>;
  removeQuotes: Quote[];
  canLift: boolean;
  isDragging: boolean;
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

const ArrowBox = styled.div`
  margin-top: ${grid * 4}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  --off-white: hsla(60, 100%, 98%, 1);
  --dark-off-white: #efefe3;
  --darker-off-white: #d6d6cb;
  --border-width: 4px;
  background: var(--off-white);
  border-radius: ${borderRadius}px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 16px;
  position: relative;
  box-sizing: border-box;
  border: var(--border-width) solid var(--dark-off-white);
  box-shadow: 0 0 0 1px var(--darker-off-white);
  margin: 2px;
  ::before {
    position: absolute;
    content: ' ';
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid var(--dark-off-white);
  }
  :active {
    border-width: 3px;
  }
`;

const ArrowButton = styled(Button)`
  width: 40px;
  height: 40px;
`;

// locking the height so that the border width change
// does not change the size of the button
const ActionButton = styled(Button)`
  height: 40px;
`;

function Controls(props: ControlProps) {
  const {
    quotes,
    canLift,
    isDragging,
    lift,
    quotesNext,
    removeQuotes,
    removeFinal,
    quotesNextMap,
  } = props;

  const [sortingIndex, setSortingIndex] = useState(1);
  const completeMoveArray = useRef<string[] | null>([]);
  const actionsRef = useRef<SnapDragActions | null>();

  const selectRef = createRef<HTMLSelectElement>();

  function maybe(fn: (callbacks: SnapDragActions) => void) {
    if (actionsRef.current) {
      fn(actionsRef.current);
    }
  }

  function timeResist() {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve('time resist');
      }, 300);
    });
  }

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

  async function moveToOrder(quoteItem) {
    console.log(quoteItem[0] + ' ' + quoteItem[1]);
    const presentQuoteId = quoteItem[0];
    const presentQuoteOrder = quoteItem[1].order;
    const nextQuoteItem = quotesNextMap.get(presentQuoteId);
    if (nextQuoteItem) {
      const nextQuoteOrder = nextQuoteItem.order;
      //다른 경우 gap 만큼 이동
      if (presentQuoteOrder !== nextQuoteOrder) {
        //pre 1 next 3
        //gap 1 - 3 = ( -2 )
        const gap = presentQuoteOrder - nextQuoteOrder;
        console.log(gap);
        actionsRef.current = lift(presentQuoteId);
        if (gap > 0) {
          await moveItem(gap, true);
          return true;
        } else {
          await moveItem(Math.abs(gap), false);
          return true;
        }
      } else {
        //같은 경우 이동 할 필요 없음
        maybe((callbacks: SnapDragActions) => {
          actionsRef.current = null;
          callbacks.drop();
        });
        return false;
      }
    }
  }
  //리펙토링 필요
  function isDifferent() {
    const quoteMap = new Map<string, quotesMapObject>();
    for (let i = 0; i < quotes.length; i++) {
      quoteMap.set(quotes[i].id, { content: quotes[i], order: i });
    }
    for (const quoteItem of Array.from(quoteMap)) {
      console.log(quoteItem[0] + ' ' + quoteItem[1]);
      const presentQuoteId = quoteItem[0];
      const presentQuoteOrder = quoteItem[1].order;
      const nextQuoteItem = quotesNextMap.get(presentQuoteId);
      if (nextQuoteItem) {
        const nextQuoteOrder = nextQuoteItem.order;
        if (presentQuoteOrder === nextQuoteOrder) {
          continue;
        } else {
          return true;
        }
      }
    }
    return false;
  }

  async function programming2() {
    const quoteMap = new Map<string, quotesMapObject>();
    for (let i = 0; i < quotes.length; i++) {
      quoteMap.set(quotes[i].id, { content: quotes[i], order: i });
    }

    let selectQuotes;
    for (const quoteItem of Array.from(quoteMap)) {
      if (quoteItem[1].order === sortingIndex) {
        selectQuotes = quoteItem;
        break;
      }
    }

    const isMoving = await moveToOrder(selectQuotes);
    if (!isMoving) {
      //움직이지 않았으면 소팅인덱스를 1씩 증가시킴
      setSortingIndex(prev => prev + 1);
    }
  }

  async function removeItemsMoveToBottom() {
    console.log('removeItemsMoveToBottom');
    //1. remove quotes 하단으로 이동
    for (let i = 0; i < removeQuotes.length; i++) {
      let targetIndex = 0;
      console.log('[seo] removeItemsMoveToBottom', completeMoveArray.current);
      if (
        completeMoveArray.current &&
        !completeMoveArray.current.includes(removeQuotes[i].id)
      ) {
        for (let j = 0; j < quotes.length; j++) {
          if (removeQuotes[i].id === quotes[j].id) {
            targetIndex = j;
            actionsRef.current = lift(removeQuotes[i].id);
            console.log('[seo] hello push');
            completeMoveArray.current.push(removeQuotes[i].id);
            break;
          }
        }
        const gap = quotes.length - targetIndex;
        await moveItem(gap, false);
        break;
      }
    }
    console.log('[seo] completeMoveArray.current', completeMoveArray.current);
    console.log('[seo] removeQuotes.length.current', completeMoveArray.current);
    //2. removeItems 정렬이 완료되었으면 제거
    if (
      completeMoveArray.current &&
      completeMoveArray.current.length === removeQuotes.length
    ) {
      removeFinal();
      completeMoveArray.current = [];
    }
  }
  useEffect(() => {
    if (removeQuotes && removeQuotes.length !== 0) {
      console.log(
        '[seo] completeMoveArray ',
        completeMoveArray,
        ' removeQuotes ',
        removeQuotes,
      );
      removeItemsMoveToBottom();
    }
    //두 배열이 다르고 소팅인덱스가 quotes.length가 아닐떄
    // if (isDifferent() && sortingIndex !== quotes.length) {
    //   programming2();
    // } else {
    //   setSortingIndex(1); //초기화
    // }
  }, [removeQuotes, quotes, sortingIndex]);

  return (
    <ControlBox>
      <button onClick={programming2}>버튼 테스트 </button>
      <select disabled={!canLift} ref={selectRef}>
        {quotes.map((quote: Quote) => (
          <option key={quote.id} value={quote.id}>
            id: {quote.id}
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
  initial: Quote[];
};

export default function DndContainer(props: Props) {
  //const [quotes, setQuotes] = useState(props.initial);
  const [leftQuotes, setLeftQuotes] = useState<Quote[]>([]);
  const [removeQuotes, setRemoveQuotes] = useState<Quote[]>([]);
  const [concatQuotes, setConcatQuotes] = useState<Quote[]>([]);
  const [quotes, setQuotes] = useState(getQuotes(5, false));
  const [quotesNext, setQuotesNext] = useState(getQuotes(5, true));
  const [quotesNextMap, setQuotesNextMap] = useState(
    new Map<string, quotesMapObject>(),
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isControlDragging, setIsControlDragging] = useState(false);
  const sensorAPIRef = useRef<SensorAPI | null>(null);

  //다음 변경될 quotes 세팅
  useEffect(() => {
    const quoteNextMap = new Map<string, quotesMapObject>();
    for (let i = 0; i < quotesNext.length; i++) {
      quoteNextMap.set(quotesNext[i].id, { content: quotesNext[i], order: i });
    }
    setQuotesNextMap(quoteNextMap);
  }, [quotes]);

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

      const newQuotes = reorder(
        quotes,
        result.source.index,
        result.destination.index,
      );
      console.log('new Quotes!');
      setQuotes(newQuotes);
    },
    [quotes],
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
    const leftQuotes: Quote[] = [];
    const quotesRemove = quotes.filter(item => {
      //중복 제거
      for (let i = 0; i < quotesNext.length; i++) {
        if (quotesNext[i].id === item.id) {
          leftQuotes.push(item); //남은 친구들
          return false;
        }
      }
      return true;
    });
    console.log('leftQuotes', leftQuotes);
    console.log('quotesRemove', quotesRemove);
    setRemoveQuotes(quotesRemove);
    setLeftQuotes(leftQuotes);
    //remove 할 애들
    //quotes 움직이기
    //remove 하기
    //추가할 애들 추가

    // newQuotes.splice(0, 1);
    //setQuotes(quotesLeft);
    // if (newQuotes.length !== 0) {
    //   setConcatQuotes(newQuotes.slice());
    // }
  }
  function removeFinal() {
    console.log('removeFinal');
    setQuotes(leftQuotes);
    setLeftQuotes([]);
  }
  // useEffect(() => {
  //   console.log('useEffect concatQuotes', concatQuotes);
  //   console.log('useEffect quotes', quotes);
  //   for (let i = 0; i < concatQuotes.length; i++) {
  //     let flag = false;
  //     for (let j = 0; j < quotes.length; j++) {
  //       if (concatQuotes[i].id === quotes[j].id) {
  //         flag = true;
  //       }
  //     }
  //     if (!flag) {
  //       setTimeout(() => {
  //         addQuotes(concatQuotes[i]);
  //       }, 1000);
  //       break;
  //     }
  //   }
  // }, [concatQuotes, quotes]);
  function addQuotes(item) {
    //기존 검색어와 현재 검색어 비교
    //다른 애들 비교
    //추가된 것 ,  없어진것
    setQuotes([...quotes, item]);
  }

  return (
    <React.Fragment>
      <button onClick={deleteItem} style={{ padding: '100px' }}>
        지우기
      </button>
      <button
        type="button"
        onClick={() => {
          setQuotes([...quotes, getQuote()]);
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
          <QuoteList listId="list" quotes={quotes} title="hello" />
          <Controls
            quotes={quotes}
            quotesNext={quotesNext}
            quotesNextMap={quotesNextMap}
            removeQuotes={removeQuotes}
            removeFinal={removeFinal}
            canLift={!isDragging}
            isDragging={isControlDragging}
            lift={lift}
          />
        </Layout>
      </DragDropContext>
    </React.Fragment>
  );
}
