// @flow
import React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
//import { Droppable, Draggable } from 'react-beautiful-dnd';
import TermsItem from './terms-item';
import { grid } from './constants';
import Title from './title';
//import type { Terms } from './types';
import { Terms } from '../../lib/api/weather';
import {
  Droppable,
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean,
): string => {
  if (isDraggingOver) {
    return colors.R50;
  }
  if (isDraggingFrom) {
    return colors.T50;
  }
  return colors.N30;
};

interface WrapperSProps {
  isDraggingOver: boolean;
  isDraggingFrom: boolean;
  isDropDisabled?: boolean;
}
const Wrapper = styled.div`
  background-color: ${(props: WrapperSProps) =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }: WrapperSProps) =>
    isDropDisabled ? 0.5 : 'inherit'};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

const scrollContainerHeight = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

type Props = {
  listId: string;
  listType?: string;
  terms: Terms[];
  title: string;
  internalScroll?: boolean;
  scrollContainerStyle?: any;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: any;
  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;

  useClone?: boolean;
};

type QuoteListProps = {
  terms: Terms[];
};

const InnerQuoteList: any = ({ terms }: QuoteListProps) => {
  return (
    terms &&
    terms.map((terms: Terms, index: number) => (
      <Draggable key={terms.keyword} draggableId={terms.keyword} index={index}>
        {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot,
        ) => (
          <TermsItem
            key={terms.keyword}
            terms={terms}
            isDragging={dragSnapshot.isDragging}
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
          />
        )}
      </Draggable>
    ))
  );
};

type InnerListProps = {
  dropProvided: DroppableProvided;
  terms: Terms[];
  title: string;
};

function InnerList(props: InnerListProps) {
  const { terms, dropProvided } = props;
  const title = props.title ? (
    <div>
      <Title>{props.title} </Title>
    </div>
  ) : null;

  return (
    <Container>
      {title}
      <DropZone ref={dropProvided.innerRef}>
        <InnerQuoteList terms={terms} />
        {dropProvided.placeholder}
      </DropZone>
    </Container>
  );
}

export default function QuoteList(props: Props) {
  const {
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = 'LIST',
    listType,
    style,
    terms,
    title,
    useClone,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={
        useClone
          ? (provided, snapshot, rubric) => (
              <TermsItem
                terms={terms[rubric.source.index]}
                provided={provided}
                isDragging={snapshot.isDragging}
                isClone
              />
            )
          : undefined
      }
    >
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot,
      ) => (
        <Wrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <ScrollContainer style={scrollContainerStyle}>
              <InnerList
                terms={terms}
                title={title}
                dropProvided={dropProvided}
              />
            </ScrollContainer>
          ) : (
            <InnerList
              terms={terms}
              title={title}
              dropProvided={dropProvided}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}
