import * as actionType from 'actions/action-type';
import { database } from 'fire-base';


export const fetchAddresses = () => {
  return dispatch => {
    return database.ref('Addresses').on('value', (snapshot) => {
      const addresses = snapshot.val();
      dispatch({
        type: actionType.ADDRESS_FETCH_ALL,
        data: addresses
      });
    });
  }
};

export const setAddress = (addressData, index) => {
  return dispatch => {
    database.ref('Addresses/' + index).set(addressData);
    dispatch({
      type: actionType.ADDRESS_SET
    });
  }
};

