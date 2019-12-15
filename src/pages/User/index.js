import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from '@store/user';
import Header from '@components/Header';

function User(props) {
  return (
    <div>
      <Header />
      <h1>Hello {props.info.name}!你最擅长的课程是{props.info.course}</h1>
    </div>
  );
}

User.loadData = store => store.dispatch(getUserInfo());

export default connect(
  state => ({
    info: state.user.info
  }),
)(User);
