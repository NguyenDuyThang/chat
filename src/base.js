
import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAgtxrlZqpgwsnXAcO8-QvguIwAcyqT9F8",
    authDomain: "chat-4c277.firebaseapp.com",
    databaseURL: "https://chat-4c277.firebaseio.com"
  });
  
const base = Rebase.createClass(firebase.database());
  
export { firebaseApp };
export default base;