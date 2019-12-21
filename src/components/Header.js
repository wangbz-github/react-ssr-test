import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
      <Link to="/">首页</Link>
      &nbsp;|&nbsp;
    <Link to="/about">关于</Link>
      &nbsp;|&nbsp;
    <Link to="/user">用户</Link>
      &nbsp;|&nbsp;
    <Link to="/asdasdasf">不存在</Link>
    </div>
  );
};