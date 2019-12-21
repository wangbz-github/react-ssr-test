import React from 'react';
import { Route } from 'react-router-dom';
import Home from '@pages/home';
import About from '@pages/about';
import User from '@pages/user';
import Login from '@pages/login';
import NotFound from '@pages/notFound';
import './App.css';

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
    exact: true,
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
  },
  {
    path: '/login',
    exact: true,
    component: Login
  },
  {
    component: NotFound
  }
]