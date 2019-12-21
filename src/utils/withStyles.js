import React from 'react';

export default function (Comp, style) {
  return function (props) {
    if (props.staticContext) {
      props.staticContext.css.push(style._getCss());
    }
    return <Comp {...props} />
  }
}