// @flow
import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
//import { Droppable, Draggable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import {
  Droppable,
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import TermsItem from './terms-item';
import { grid } from './constants';
import Title from './title';
//import type { Terms } from './types';
import { Terms } from '../../lib/api/weather';

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean,
): string => {
  if (isDraggingOver) {
    return colors.N700A;
  }
  if (isDraggingFrom) {
    return colors.T50;
  }
  return '#000000';
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
  sm: string;
  useClone?: boolean;
};

type QuoteListProps = {
  terms: Terms[];
};

type ItemProps = {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  terms: Terms;
  isDragging: boolean;
  isGroupedOver: boolean;
};

interface PortalSProps {
  inPortal: boolean;
}
const SimpleQuote = styled.div`
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  background-color: ${colors.B50};
  border: 1px solid ${colors.B200};
  /* used for positioning the after content */
  position: relative;
  /* stylelint-disable  comment-empty-line-before */
  /* add little portal indicator when in a portal */
  ${(props: PortalSProps) =>
    props.inPortal
      ? `
    ::after {
      position: absolute;
      background: lightgreen;
      padding: ${grid}px;
      bottom: 0;
      right: 0;
      content: "in portal";
    }
  `
      : ''}/* stylelint-enable */;
`;
/* 포탈 사용  */
class PortalAwareItem extends Component<ItemProps> {
  render() {
    const { provided } = this.props;
    const { snapshot } = this.props;
    const { terms } = this.props;

    const { isDragging } = this.props;
    const { isGroupedOver } = this.props;
    const usePortal: boolean = snapshot.isDragging;

    const child = (
      <>
        <TermsItem
          key={terms.keyword}
          terms={terms}
          isDragging={isDragging}
          isGroupedOver={isGroupedOver}
          provided={provided}
        />
        {/*
      <SimpleQuote
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        inPortal={usePortal}
      >
        {terms.keyword}
      </SimpleQuote>
      */}
      </>
    );

    if (!usePortal) {
      return child;
    }
    let portal;
    if (document) {
      portal = document.getElementById('portal') as any;
    }
    // if dragging - put the item in a portal
    return ReactDOM.createPortal(child, portal);
  }
}
const InnerQuoteList: any = ({ terms }: QuoteListProps) => {
  return (
    terms &&
    terms.map((terms: Terms, index: number) => (
      <Draggable
        key={`${terms.keyword}_${index}`}
        draggableId={terms.keyword}
        index={index}
      >
        {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot,
        ) => (
          <>
            <PortalAwareItem
              terms={terms}
              provided={dragProvided}
              snapshot={dragSnapshot}
              isDragging={dragSnapshot.isDragging}
              isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            />
            {/*
          <TermsItem
            key={terms.keyword}
            terms={terms}
            isDragging={dragSnapshot.isDragging}
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
          />
                      */}
          </>
        )}
      </Draggable>
    ))
  );
};

type InnerListProps = {
  dropProvided: DroppableProvided;
  terms: Terms[];
  title: string;
  sm: string;
};

function InnerList(props: InnerListProps) {
  const { terms, dropProvided, sm } = props;
  const title = props.title ? (
    <div>
      <Title>{props.title} </Title>
    </div>
  ) : null;

  return (
    <Container>
      <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 600 }}>
        {title}
      </span>
      <div style={{ color: 'white', fontSize: '0.8rem', margin: '3px' }}>
        {moment(sm).format('YYYY년 MM월 DD일 HH시 mm분')}
      </div>
      <DropZone ref={dropProvided.innerRef}>
        <InnerQuoteList terms={terms} />
        {dropProvided.placeholder}
      </DropZone>
    </Container>
  );
}

export default function TermsList(props: Props) {
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
    sm,
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
                sm={sm}
              />
            </ScrollContainer>
          ) : (
            <InnerList
              terms={terms}
              title={title}
              dropProvided={dropProvided}
              sm={sm}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}
