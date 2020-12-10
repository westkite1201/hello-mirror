import React from 'react';
type InfoProps = {
  infoString: string;
};
const Info: React.FC<InfoProps> = ({ infoString }) => {
  return (
    <h1 id="info" style={{ padding: '2rem' }}>
      {infoString}
    </h1>
  );
};
export default Info;
