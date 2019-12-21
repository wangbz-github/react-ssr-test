// action type
const GET_INFO = 'USER/INFO';

// action creator 
const changeInfo = (info) => ({
  type: GET_INFO,
  payload: info
});


const defaultState = {
  info: {}
};

export const getUserInfo = server => {
  //getState? axiosInstance?
  return (dispatch, getState, axiosInstance) => {
    return axiosInstance.get('/api/user/info')
      .then(res => {
        const { info } = res.data;
        console.log('用户', info)
        dispatch(changeInfo(info));
      });
  };
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_INFO:
      return { ...state, info: action.payload }
    default:
      return state;
  }
}