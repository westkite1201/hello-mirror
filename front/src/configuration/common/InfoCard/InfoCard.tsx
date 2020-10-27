import React from 'react';
import styled from 'styled-components';

type InfoCardProps = {
  icon: string;
  info: string;
};

const InfoCard = ({ icon, info }: InfoCardProps) => {
  return (
    <InfoCardWrapper>
      <InfoCardIcon> {icon}</InfoCardIcon>
      <InfoCardInfo> {info}</InfoCardInfo>
    </InfoCardWrapper>
  );
};

const InfoCardWrapper = styled.div`
  border-radius: 4px;
  margin-top: 1rem;
  padding: 1.5rem;
  font-family: 'NanumMyeongjo';
  width: 100%;
  text-align: center;
  background: #e55d87; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #5fc3e4,
    #e55d87
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #5fc3e4,
    #e55d87
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  color: white;
  cursor: pointer;
  transition: all 0.5s ease;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4);
  &:hover {
    overflow: visible;
    transform: translate3d(0, 10px, 0) scale3d(1, 1, 1);
    box-shadow: 0px 30px 100px -10px rgba(0, 0, 0, 0.8);
  }
`;

const InfoCardIcon = styled.div`
  display: flex;
  justify-content: center;
`;
const InfoCardInfo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;
export default InfoCard;
