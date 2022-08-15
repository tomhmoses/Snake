import { Wrapper } from './wrapper';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from "firebase/auth";
import { useAuthState } from 'react-firehooks/auth';

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
const firestore = getFirestore(app);


function App() {

  const auth = getAuth();
  console.log('getting auth')
  signInAnonymously(auth)
    .then(() => {
      console.log('signed in')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      return 'anonymous login error';
    });
    const [user] = useAuthState(auth);
    return ( <Wrapper user={user} firestore={firestore} /> );
}

export default App;
