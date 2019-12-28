import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export default function (Comp, style) {

  const NewComp = function (props) {
    if (props.staticContext) {
      props.staticContext.css.push(style._getCss());
    }
    return <Comp {...props} />
  };

  hoistNonReactStatic(NewComp, Comp);
  return NewComp;
}