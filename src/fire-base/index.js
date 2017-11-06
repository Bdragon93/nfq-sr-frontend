import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCIBVUtaRhZv5SlPSnZ0sF8vhFvDMG9EL8',
  authDomain: 'frontend-nfq-test.firebaseapp.com',
  databaseURL: 'https://frontend-nfq-test.firebaseio.com',
  storageBucket: 'frontend-nfq-test.appspot.com',
};
firebase.initializeApp(config);
export const database = firebase.database();
