import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD-8NmryL7XAVVGa5Md85XDKMQ7GzDr9-o',
  authDomain: 'counselai-f45fb.firebaseapp.com',
  projectId: 'counselai-f45fb',
  storageBucket: 'counselai-f45fb.appspot.com',
  messagingSenderId: '545576790428',
  appId: '1:545576790428:ios:ea058a725fd98cc7ef8059',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;
