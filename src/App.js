import React from 'react';
import { Route } from 'react-router-dom';
import Home from '@pages/Home';
import About from '@pages/About';
import User from '@pages/User';

// function App() {
//   return (
//     <div>
//       <Route path="/" exact component={Home} />
//       <Route path="/about" exact component={About} />
//     </div>
//   );
// }

// export default App;


//改造成通过js导出路由哦配置

export default [
  {
    path: '/',
    //exact: true,
    component: Home
  },
  {
    path: '/about',
    exact: true,
    component: About
  },
  {
    path: '/user',
    exact: true,
    component: User
  }
]