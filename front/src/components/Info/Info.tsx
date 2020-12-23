import React from 'react';
import styled from 'styled-components';

const St = {
  InfoDisplay: styled.h3`
    font-family: GmarketSans-medium;
  `,
};
type InfoProps = {
  infoString: string;
};
const Info: React.FC<InfoProps> = ({ infoString }) => {
  return (
    <St.InfoDisplay id="info" style={{ padding: '2rem' }}>
      {infoString}
    </St.InfoDisplay>
  );
};
export default Info;
