import axios from '@utils/axios';

// action type
const GET_LIST = 'HOME/LIST';

// action creator 
const changeList = (list) => ({
  type: GET_LIST,
  payload: list
});


const defaultState = {
  list: []
};

export const getCourseList = server => {
  //getState? axiosInstance?
  return (dispatch, getState, axiosInstance) => {
    return axios.get('/api/course/list')
      .then(res => {
        const { list } = res.data;
        console.log('课程', list)
        dispatch(changeList(list));
      });
  };
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_LIST:
      return { ...state, list: action.payload }
    default:
      return state;
  }
}