import React, { useState, useEffect ,Fragment} from 'react';
import {   DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided, } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
//import { GET_QUOTES_REQUEST } from '../../modules/quotes_te/reducer';
import { GET_QUOTES_REQUEST,UPDATE_QUOTES_REQUEST } from '../../modules/quotes_ts/reducer';
// const initial = Array.from({ length: 10 }, (v, k) => k).map((k) => {
//   const custom = {
//     id: `id-${k}`,
//     content: `Quote ${k}`
//   };

//   return custom;
// });
type IQuote ={
  id : string;
  word: string;
  name: string;
  key : any;
}
type originQuote ={
  _id : string;
  word: string;
  name: string;
  key : any;
}
export interface QuotesItemProps {
  quote: IQuote;
  index: number;
  setting : (quote)=>void;
}

export interface QuotesListProps {
  quotes: IQuote[];
  setting : (quote:IQuote)=>void;
}
const reorder = (list : IQuote[], startIndex : number, endIndex:number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: 8px;
  background-color: lightblue;
  padding: 8px;
`;


const Quote: React.FC<QuotesItemProps>  = ({quote , index,setting}) => {
  return (
    <Fragment>
    <Draggable draggableId={quote.id} index={index}>
        {(provided:DroppableProvided) => (
          <QuoteItem
            onClick ={() => setting(quote)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>{quote.word}</div>
            <div> {quote.name}</div>

          </QuoteItem>
        )}
      </Draggable>
      
    </Fragment>
 
  );
}

const QuoteList:React.FC<QuotesListProps> = ( {quotes,setting} ) => {
  const quotesList = quotes.map((quote:IQuote, index:number) => {
    return <Quote quote={quote} index={index} setting={setting} key ={quote.id}/>;
  }); 
  return <Fragment>{quotesList}</Fragment>
}


function addId(quotes : originQuote[]) {
  return quotes.reduce((acc:IQuote[], curr:originQuote) => {
    acc.push({ ...curr, id: curr._id });
    return acc;
  }, []);
}
function QuotesManageContainer() {
  const [quote, setQuote] = useState<IQuote>()
  const [word, setWord] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [state, setState] = useState<IQuote[]>([]);
  //const { quotesData } = useSelector((state) => state.quotes);
  const { quotesData_ } = useSelector((state) => state.quotes_);
  const setting = ( quote:IQuote) => {
    setWord(quote.word);
    setName(quote.name);
    setId(quote.id)
    setQuote(quote)
  };

  const dispatch = useDispatch();
  useEffect(() => {
    //전부다 받아오기
    function dispatchQuotes() {
      dispatch({
        type: GET_QUOTES_REQUEST,
        payload: { accepted: '0' }
      });
    }
    dispatchQuotes();
  }, [dispatch]);

  useEffect(() => {
    if (quotesData_.data && quotesData_.data.length !== 0) {
      console.log("addId(quotesData.data) ",addId(quotesData_.data))
      setState(addId(quotesData_.data)) 
    }
  }, [quotesData_.data]);

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      state,
      result.source.index,
      result.destination.index
    );
    console.log('quotes ', quotes);
    setState(quotes);
  }

  const handleName = (e:React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleWord = (e:React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };
  const handleUpdate = () => {
    let newQuote = {...quote,name:name,word:word, _id : id}
    console.log("HELLO NEWquotes" , newQuote)
    dispatch({type : UPDATE_QUOTES_REQUEST, payload :newQuote})
  };
  
  console.log('quotesData_', quotesData_)
  return (
    <div>
      <input onChange={handleName} value={name} />
      <input onChange={handleWord} value={word} />
      <button onClick={handleUpdate}>업뎃</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided:DroppableProvided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <QuoteList quotes={state} setting={setting}/>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default QuotesManageContainer;
