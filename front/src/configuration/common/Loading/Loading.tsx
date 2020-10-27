import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ size, color }) => {
  const antIcon = (
    <LoadingOutlined style={{ fontSize: size, color: color }} spin />
  );
  return <Spin indicator={antIcon} />;
};

export default Loading;
