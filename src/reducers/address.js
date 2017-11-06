import * as actionType from 'actions/action-type';

const addressReducer = (state = [], action) => {
  const { type, data } = action;
  const newState = [];
  switch (type) {
    case actionType.ADDRESS_FETCH_ALL:
      for(const item of data) {
        item.index = data.indexOf(item);
        newState.push(item);
      }  
      return newState;
    default:
      return state
  }
}

export default addressReducer;
