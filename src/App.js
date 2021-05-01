import React,  { useState, useRef }  from 'react'
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
    apiKey: "AIzaSyCeuvYCHCJ4hHFpTtNaP7wQ83jTcZxQlF4",
    authDomain: "react-chat-vs.firebaseapp.com",
    projectId: "react-chat-vs",
    storageBucket: "react-chat-vs.appspot.com",
    messagingSenderId: "565483800517",
    appId: "1:565483800517:web:13a5926f07fa2f9af3adac"
})

const auth = firebase.auth();
const firestore = firebase.firestore()

function App() {

    const [user] = useAuthState(auth)
    return(
        <div className='App'>
            <header>🔥💬</header>

            <section>{user ? <ChatRoom /> : <SignIn />}</section></div>

    )
}

function SignIn() {
    const signInWithGoogle = () =>{
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
    }
    return(
        <button onClick={signInWithGoogle}> Sign in with google </button>
    )
}

function SighOut() {
    return auth.currentUser && (
        <button onClick={()=>auth.signOut()}>Sign Out</button>
    )
}

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');


    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })

        setFormValue('');
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (<>
        <main>

            {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

            <span ref={dummy}></span>

        </main>

        <form onSubmit={sendMessage}>

            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

            <button type="submit" disabled={!formValue}>💬</button>

        </form>
    </>)
}

function ChatMessage(props) {
    const {text, uid} = props.message

    return <p>{text}</p>
}

export default App;
