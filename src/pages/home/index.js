import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getCourseList } from '@store/home';
import Header from '@components/Header';
import withStyles from '@utils/withStyles.js';
import style from './home.css';

function Home(props) {

  // if (props.staticContext) {
  //   //style._getCss() 为服务端独有
  //   props.staticContext.css.push(style._getCss());
  // }


  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!props.list.length) {
      props.getCourseList();
    }
  }, []);
  return (
    <div>
      <Header />
      <h1 className={style.title}>Hello React SSR Test!</h1>
      <h2>点击了{count}次</h2>
      <button onClick={() => { setCount(count + 1) }}>计数器</button>
      <hr />
      <ul>
        {props.list.map(item => (
          <li key={item.id} className={style.content}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

Home.loadData = store => store.dispatch(getCourseList());

export default connect(
  state => ({
    list: state.home.list
  }),
  { getCourseList }
)(withStyles(Home, style));
