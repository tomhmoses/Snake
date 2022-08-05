import { Game } from './game';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuYPEaXlrwq0ixDOElAa_4gj_Ls31jYe0",
  authDomain: "xando-tm.firebaseapp.com",
  projectId: "xando-tm",
  storageBucket: "xando-tm.appspot.com",
  messagingSenderId: "560196621324",
  appId: "1:560196621324:web:b29deead2367dc80af4a29",
  measurementId: "G-JGE03J1MNB"
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);


function App() {

  return (
    <Game />
  );
}

export default App;
