import * as React from 'react';
import ReactGridLayout from 'react-grid-layout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ResponsiveReactGridLayout = WidthProvider(ReactGridLayout);

class GridWrapper extends React.Component {
  render() {
    return (
      <ResponsiveReactGridLayout
        measureBeforeMount={true}
        // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        verticalCompact={false}
      >
        <div key="1">a</div>
        <div key="2">b</div>
        <div key="3">c</div>
      </ResponsiveReactGridLayout>
    );
  }
}
export default GridWrapper;

// class ResponsiveGridTest extends React.Component {
//   render() {
//     const layouts = {
//       lg: [
//         { i: '1', x: 0, y: 0, w: 1, h: 2, static: true },
//         { i: '2', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
//         { i: '3', x: 4, y: 0, w: 1, h: 2 },
//       ],
//     };

//     return (
//       <Responsive
//         layouts={layouts}
//         width={800}
//         breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//         cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//       >
//         <div key="1">a</div>
//         <div key="2">b</div>
//         <div key="3">c</div>
//       </Responsive>
//     );
//   }
// }
