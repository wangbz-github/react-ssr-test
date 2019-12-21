import React from 'react';
import { Route } from 'react-router-dom';

function Status({ code, children }) {
  return <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.statusCode = code;
      }
      return children;
    }}
  />
}

function NotFound(props) {
  //server端渲染，使用staticRouter时，才会拿到staticContext
  console.log('notfound', props);

  return (
    <Status code={404}>
      <h1>404 Not Found</h1>
    </Status>
  );
}

export default NotFound;