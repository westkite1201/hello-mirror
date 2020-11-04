import React, { useEffect, useState } from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import _ from 'lodash';
const data = {
  id: 'root',
  name: 'NCMS',
  children: [
    {
      id: '1',
      name: '분석',
    },
    {
      id: '3',
      name: '측정',
      children: [
        {
          id: '4',
          name: 'Child - 4',
        },
      ],
    },
  ],
};

// const useStyles = makeStyles({
//   root: {
//     height: 110,
//     flexGrow: 1,
//     maxWidth: 400,
//   },
// });
type ObjectItem = {
  id: string;
  name: any;
  children: {
    id: string;
    name: string;
    children: {
      id: string;
      name: string;
    };
  };
};

const RecursiveTreeView = ({ pureComponents, addSelectedComponent }) => {
  console.log('addSelectedComponent', addSelectedComponent);
  const [objectArr, setObjectArr] = useState([data]);

  useEffect(() => {
    console.log('pureComponents', pureComponents);
    const hello = _.groupBy(pureComponents, 'category');
    const objectArr = Object.keys(hello).map((item, key) => {
      const objectCategory = hello[item];
      const cateNm = _.find(hello[item], 'category').category; // ncms ,cms
      console.log('objectCategory ', objectCategory);
      const childrenObj = _.groupBy(objectCategory, 'pageView');
      console.log('childrenObj ', childrenObj);
      const sub = Object.keys(childrenObj).map((item, key) => {
        //item = 장애조회, 분석
        return {
          id: item + '_' + key,
          name: item,
          children: childrenObj[item].map((item, key) => {
            //const componentName = Object.keys(item)[0];
            return {
              id: item.category + '_' + item.pageView + '_' + key,
              name: item.name,
            };
          }),
        };
      });
      return {
        id: item + '_' + key,
        name: cateNm,
        children: sub,
      };
    });

    setObjectArr(objectArr);
  }, [pureComponents]);

  const renderTree = nodes => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.name}
      label={nodes.name}
      onClick={() =>
        Array.isArray(nodes.children) ? null : addSelectedComponent(nodes.name)
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map(node => renderTree(node))
        : null}
    </TreeItem>
  );
  console.log('objectArr ', objectArr);
  if (objectArr.length === 0) {
    return null;
  }
  return (
    <TreeView
      className="root-tree-view"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(objectArr[0])}
    </TreeView>
  );
};

export default RecursiveTreeView;
