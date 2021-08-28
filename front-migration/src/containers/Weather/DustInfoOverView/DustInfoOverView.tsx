import React, { Fragment } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import Divider from '@material-ui/core/Divider';
import Progress from '../../../components/common/Progress';
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      margin: 'auto',
      backgroundColor: 'rgba( 255, 255, 255, 0 )',
    },
  }),
);
type ProgressProps = {
  color: string;
  level: number;
  value: string;
};
/* progress 만들기  */
const makeProgress = (dustMessageInfo: ProgressProps) => {
  const { level, value } = dustMessageInfo;
  let { color } = dustMessageInfo;
  //초기
  color === '' ? (color = '#ffffff') : (color = color);
  return (
    <Progress
      backgroundColor={color}
      fcstValue={level * 12.5}
      value={parseInt(value)}
      height={15}
    />
  );
};
type DustInfoOverViewProps = {
  weather: any;
};
const DustInfoOverView: React.FC<DustInfoOverViewProps> = ({ weather }) => {
  console.log('[SEO][dustInfoObject] ');
  const {
    dustMessageInfoPm10,
    dustMessageInfoPm25,
    dustMessageInfoO3,
    dustMessageInfoCo,
    dustMessageInfoNo2,
    dustMessageInfoSo2,
  } = weather.dustInfoObject;
  const classes = useStyles();
  console.log('[SEO][dustMessageInfoPm10] ', Object.keys(dustMessageInfoPm10));
  const dustInfoArr = [
    {
      name: 'pm10',
      object: dustMessageInfoPm10,
      objectName: 'dustMessageInfoPm10',
    },
    {
      name: 'pm25',
      object: dustMessageInfoPm25,
      objectName: 'dustMessageInfoPm25',
    },
    {
      name: 'O3',
      object: dustMessageInfoO3,
      objectName: 'dustMessageInfoO3',
    },
    {
      name: 'co',
      object: dustMessageInfoCo,
      objectName: 'dustMessageInfoCo',
    },
    {
      name: 'no2',
      object: dustMessageInfoNo2,
      objectName: 'dustMessageInfoNo2',
    },
    {
      name: 'So2',
      object: dustMessageInfoSo2,
      objectName: 'dustMessageInfoSo2',
    },
  ];
  function makeDustInfoBar() {
    return dustInfoArr.map((item, key) => {
      return (
        <Fragment key={key}>
          <ListItem
            button
            onClick={() => weather.setSelectDustMessageInfo(item.objectName)}
            key={key}
          >
            <ListItemAvatar>
              <Avatar>{item.name}</Avatar>
            </ListItemAvatar>
            {makeProgress(item.object)}
          </ListItem>
          <Divider variant="inset" component="li" />
        </Fragment>
      );
    });
  }

  return <List className={classes.root}>{makeDustInfoBar()}</List>;
};

export default DustInfoOverView;
