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
import QuoteList from './quote-list';
import reorder from './reorder';
import { grid, borderRadius } from './constants';
import { useSelector, useDispatch } from 'react-redux';
import { getRealtimeTermsRequest } from '../../store/weather/reducer';
import { Terms } from '../../lib/api/weather';
import { RootState } from '../../store/rootReducer';
interface quotesMapObject {
  content: Terms;
  order: number;
}
type ControlProps = {
  quotes: Terms[];
  quotesNext: Terms[];
  quotesNextMap: Map<string, quotesMapObject>;
  removeQuotes: Terms[];
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

const TIME_INTERVAL = 200;
function Controls(props: ControlProps) {
  const {
    quotes,
    canLift,
    isDragging,
    lift,
    //quotesNext,
    removeQuotes,
    removeFinal,
    isAdded,
    isRemoved,
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
  //정렬 함수
  async function moveToOrder(quoteItem) {
    console.log('[seo] movetoOrder ', quoteItem[0] + ' ' + quoteItem[1]);
    const presentQuoteId = quoteItem[0];
    const presentQuoteOrder = quoteItem[1].order;
    const nextQuoteItem = quotesNextMap.get(presentQuoteId);
    console.log(
      '[seo] presentQuoteId ',
      presentQuoteId,
      ' presentQuoteOrder = ',
      presentQuoteOrder,
      ' nextQuoteItem ',
      nextQuoteItem,
    );
    if (nextQuoteItem) {
      const nextQuoteOrder = nextQuoteItem.order;
      //다른 경우 gap 만큼 이동
      if (presentQuoteOrder !== nextQuoteOrder) {
        //pre 1 next 3
        //gap 1 - 3 = ( -2 )
        const gap = presentQuoteOrder - nextQuoteOrder;
        console.log('[SEO] GAP ', gap);
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
  //다른지 비교
  function isDifferent() {
    const quoteMap = new Map<string, quotesMapObject>();
    for (let i = 0; i < quotes.length; i++) {
      quoteMap.set(quotes[i].keyword, { content: quotes[i], order: i });
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

  async function setting() {
    const quoteMap = new Map<string, quotesMapObject>();
    //다이나믹함을 위아래 랜덤으로 위아래
    if (Math.floor(Math.random() * 2) % 2 === 0) {
      console.log('[seo][setting] 위');
      for (let i = 0; i < quotes.length; i++) {
        quoteMap.set(quotes[i].keyword, { content: quotes[i], order: i });
      }
    } else {
      console.log('[seo][setting] 아래');
      for (let i = quotes.length - 1; i >= 0; i--) {
        quoteMap.set(quotes[i].keyword, { content: quotes[i], order: i });
      }
    }

    let selectQuotes;
    for (const quoteItem of Array.from(quoteMap)) {
      if (quoteItem[1].order === sortingIndex) {
        selectQuotes = quoteItem;
        break;
      }
    }
    console.log('[seo] selectQuotes] ', selectQuotes);
    const isMoving = await moveToOrder(selectQuotes);
    if (!isMoving) {
      //움직이지 않았으면 소팅인덱스를 1씩 증가시킴
      setSortingIndex(prev => prev + 1);
    }
  }

  async function removeItemsMoveToBottom() {
    console.log('[seo] removeItemsMoveToBottom');
    //1. remove quotes 하단으로 이동
    for (let i = 0; i < removeQuotes.length; i++) {
      let targetIndex = 0;
      if (
        completeMoveArray.current &&
        !completeMoveArray.current.includes(removeQuotes[i].keyword)
      ) {
        for (let j = 0; j < quotes.length; j++) {
          if (removeQuotes[i].keyword === quotes[j].keyword) {
            targetIndex = j;
            actionsRef.current = lift(removeQuotes[i].keyword);
            completeMoveArray.current.push(removeQuotes[i].keyword);
            break;
          }
        }
        const gap = quotes.length - targetIndex;
        await moveItem(gap, false);
        //break;
        return;
      }
    }
    //2. removeItems 정렬이 완료되었으면 제거
    if (
      completeMoveArray.current &&
      completeMoveArray.current.length === removeQuotes.length
    ) {
      //setTimeout(() => {
      removeFinal();
      completeMoveArray.current = [];
      //}, TIME_INTERVAL + 500);
    }
  }
  useEffect(() => {
    if (!isRemoved && !isAdded && removeQuotes && removeQuotes.length !== 0) {
      removeItemsMoveToBottom();
    }
    console.log('[seo] isRemoved', isRemoved);
    console.log('[seo] isAdded', isAdded);
    if (
      isRemoved &&
      isAdded &&
      isDifferent() &&
      sortingIndex !== quotes.length
    ) {
      console.log('[seo] setting hello');
      setTimeout(() => {
        setting();
      }, TIME_INTERVAL);
    } else {
      setSortingIndex(1); //초기화
    }
  }, [isRemoved, isAdded, removeQuotes, quotes, sortingIndex]);

  return (
    <ControlBox>
      <button onClick={setting}>버튼 테스트 </button>
      <select disabled={!canLift} ref={selectRef}>
        {quotes.map((quote: Terms) => (
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
  //const [quotes, setQuotes] = useState(props.initial);
  const [leftQuotes, setLeftQuotes] = useState<Terms[]>([]);
  const [removeQuotes, setRemoveQuotes] = useState<Terms[]>([]);
  const [concatQuotes, setConcatQuotes] = useState<Terms[]>([]);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const completeAddedArray = useRef<string[] | null>([]);
  const [quotes, setQuotes] = useState(getTerms(10, false));
  const [quotesNext, setQuotesNext] = useState(getTerms(10, true));
  const [quotesNextMap, setQuotesNextMap] = useState(
    new Map<string, quotesMapObject>(),
  );
  const { realtimeTerms } = useSelector((state: RootState) => state.weather);
  const [isDragging, setIsDragging] = useState(false);
  const [isControlDragging, setIsControlDragging] = useState(false);
  const sensorAPIRef = useRef<SensorAPI | null>(null);
  const dispatch = useDispatch();

  //다음 변경될 quotes 세팅
  useEffect(() => {
    const quoteNextMap = new Map<string, quotesMapObject>();
    for (let i = 0; i < quotesNext.length; i++) {
      quoteNextMap.set(quotesNext[i].keyword, {
        content: quotesNext[i],
        order: i,
      });
    }
    /* dispacth  */
    dispatch(getRealtimeTermsRequest());

    setQuotesNextMap(quoteNextMap);
  }, []);

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
    const leftQuotes: Terms[] = [];
    //const concatQuotes = new Map<string, Terms>();
    //const concatQuotes: Terms[] = [];
    const quotesRemove = quotes.filter(item => {
      //중복 제거
      for (let i = 0; i < quotesNext.length; i++) {
        if (quotesNext[i].keyword === item.keyword) {
          leftQuotes.push(Object.assign({}, item)); //남은 친구들
          return false;
        }
      }
      return true;
    });

    const concatQuotes = quotesNext.filter(item => {
      //중복 제거
      for (let i = 0; i < quotes.length; i++) {
        if (quotes[i].keyword === item.keyword) {
          return false;
        }
      }
      return true;
    });
    //삭제 될게 없다면
    if (quotesRemove && quotesRemove.length === 0) {
      setIsRemoved(true);
    }
    if (concatQuotes && concatQuotes.length === 0) {
      setIsAdded(true);
    }
    console.log('[seo] leftQuotes', leftQuotes);
    console.log('[seo] quotesRemove', quotesRemove);
    console.log('[seo] concatQuotes', concatQuotes);
    setRemoveQuotes(quotesRemove); //제거할 애들
    setLeftQuotes(leftQuotes.slice()); //본 quetos에 서 남은 애들
    setConcatQuotes(concatQuotes);
    //setConcatQuotesMap(concatQuotes);
    //remove 할 애들setConcatQuotes
    //quotes 움직이기
    //remove 하기
    //추가할 애들 추가
  }
  function removeFinal() {
    console.log('[seo] removeFinal leftQuotes ', leftQuotes);
    setQuotes(leftQuotes);
    setIsRemoved(true); // remove 종료 flag 세팅
    //setLeftQuotes([]);
  }

  useEffect(() => {
    console.log('[seo] useEffect quotes!!!', quotes);
    //remove 종료시 concat 추가
    //add quotes
    if (isRemoved && !isAdded) {
      //for (const quoteItem of Array.from(concatQuotesMap)) {
      // console.log('[seo] concatQuotes', concatQuotes);
      // console.log('[seo] quotes', quotes);
      for (let i = 0; i < concatQuotes.length; i++) {
        let flag = false;
        for (let j = 0; j < quotes.length; j++) {
          if (concatQuotes[i].keyword === quotes[j].keyword) {
            flag = true;
          }
        }
        if (!flag) {
          setTimeout(() => {
            addQuotes(concatQuotes[i]);
            if (completeAddedArray && completeAddedArray.current) {
              completeAddedArray.current.push(concatQuotes[i].keyword);
            }
          }, TIME_INTERVAL);
          console.log('[seo] return');
          return;
        }
      }
      setIsAdded(true);
      //}
    }
  }, [concatQuotes, isRemoved, isAdded, quotes]);

  function addQuotes(item) {
    console.log('[seo] addQuotes!');
    setQuotes([...quotes, item]);
  }

  return (
    <React.Fragment>
      <button onClick={deleteItem} style={{ padding: '20px' }}>
        지우기
      </button>
      <button
        type="button"
        onClick={() => {
          setQuotes([...quotes, getTerm()]);
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
            isAdded={isAdded}
            isRemoved={isRemoved}
            lift={lift}
          />
        </Layout>
      </DragDropContext>
    </React.Fragment>
  );
}
