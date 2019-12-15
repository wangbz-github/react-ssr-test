import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getCourseList } from '@store/home';
import Header from '@components/Header';

function Home(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!props.list.length) {
      props.getCourseList();
    }
  }, []);
  return (
    <div>
      <Header />
      <h1>Hello React SSR Test!</h1>
      <h2>点击了{count}次</h2>
      <button onClick={() => { setCount(count + 1) }}>计数器</button>
      <hr />
      <ul>
        {props.list.map(item => (
          <li key={item.id}>{item.name}</li>
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
)(Home);
