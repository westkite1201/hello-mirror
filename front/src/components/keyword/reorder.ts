// @flow
import type { Terms } from '../../lib/api/weather';
import type { DraggableLocation } from 'react-beautiful-dnd';

type TermsMap = {
  [key: string]: Terms[];
};
// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  console.log('[seo] drag startIndex, ', startIndex, ' endIndex ', endIndex);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

type ReorderQuoteMapArgs = {
  quoteMap: TermsMap;
  source: DraggableLocation;
  destination: DraggableLocation;
};

export type ReorderQuoteMapResult = {
  quoteMap: TermsMap;
};

export const reorderQuoteMap = ({
  quoteMap,
  source,
  destination,
}: ReorderQuoteMapArgs): ReorderQuoteMapResult => {
  const current: Terms[] = [...quoteMap[source.droppableId]];
  const next: Terms[] = [...quoteMap[destination.droppableId]];
  const target: Terms = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Terms[] = reorder(
      current,
      source.index,
      destination.index,
    );
    const result: TermsMap = {
      ...quoteMap,
      [source.droppableId]: reordered,
    };
    return {
      quoteMap: result,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: TermsMap = {
    ...quoteMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    quoteMap: result,
  };
};
