import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
type LoadingProps = {
  size: string;
  color: string;
};
const Loading: React.FC<LoadingProps> = ({ size, color }) => {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: size, color: color }} spin />
  );
  return <Spin indicator={antIcon} />;
};

export default Loading;
