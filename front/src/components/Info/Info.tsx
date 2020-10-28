import React from 'react';
type InfoProps = {
  infoString: string;
};
const Info: React.FC<InfoProps> = ({ infoString }) => {
  return (
    <div className="neon green" style={{ padding: '2rem' }}>
      {infoString}
    </div>
  );
};
export default Info;
