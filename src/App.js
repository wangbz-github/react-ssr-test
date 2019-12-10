import React, { useState } from 'react';

function App(props) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello {props.title}!</h1>
      <h2>点击了{count}次</h2>
      <button onClick={() => { setCount(count + 1) }}>计数器</button>
    </div>
  );
}

export default <App title="React SSR Test" />;