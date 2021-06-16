import React from 'react';
import { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyDDcN_F2BI3BgnN27zSfQ5Yfwq-qjoKN1s",
    authDomain: "videoconf-2e5a9.firebaseapp.com",
    projectId: "videoconf-2e5a9",
    storageBucket: "videoconf-2e5a9.appspot.com",
    messagingSenderId: "861828702960",
    appId: "1:861828702960:web:b5f7d20434364e5dc25835",
    measurementId: "G-Y5C7NFPCNN"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Your own Chatting App!</h1> 
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const googleprovider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(googleprovider).then((res) =>{
      console.log(res.user)
    }).catch((error) => {
      console.log(error.message);
    });
  }
    return (
      <button className="sign-in" onClick = {signInWithGoogle}>Sign in with Google </button> 
    )
}

function SignOut() {
  return auth.currentUser && (
    <button className = "sign-out" onClick = {() => auth.signOut()}> Sign Out </button>
  )
}
function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField :' id'});
  const [formValue, setFormValue] = useState('');
  
  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL
    })
    setFormValue('');
    
    dummy.current.scrollIntoView({behavior:'smooth'});
  }
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key = {msg.id} message ={msg} />)};
        <div ref = {dummy}> </div> 
       </main>
        <form onSubmit={sendMessage}>
          <input value = {formValue} onChange={(e) => setFormValue(e.target.value)}/>
          <button type="submit">Submit</button>
        </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src= {photoURL} alt=""/>
      <p>{text}</p>
    </div>
  )
}
export default App;
