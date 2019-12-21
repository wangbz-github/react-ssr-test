import React from 'react';
import Header from '@components/Header';
import style from './about.css';

function About(props) {
  if (props.staticContext) {
    //style._getCss() 为服务端独有
    props.staticContext.css.push(style._getCss());
  }

  return (
    <div>
      <Header />
      <h1 className={style.title}>关于 React SSR Test</h1>
    </div>
  );
}

export default About;