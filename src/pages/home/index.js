import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getCourseList } from '@store/home';

function Home(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    props.getCourseList();
  }, []);
  return (
    <div>
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

export default connect(
  state => ({
    list: state.home.list
  }),
  { getCourseList }
)(Home);
