import React from 'react';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

/* param 정의할 것  */
export default function Progress({
  backgroundColor,
  fcstValue,
  value,
  height = 10,
}) {
  const classes = useStyles();
  const BorderLinearProgress = withStyles({
    root: {
      height: height,
      borderRadius: 20,
      backgroundColor: lighten(backgroundColor, 0.5),
    },
    bar: {
      borderRadius: 20,
      backgroundColor: backgroundColor,
    },
  })(LinearProgress);

  return (
    <div className={classes.root}>
      <BorderLinearProgress
        className={classes.margin}
        variant="determinate"
        color="secondary"
        value={fcstValue}
      />
    </div>
  );
}
