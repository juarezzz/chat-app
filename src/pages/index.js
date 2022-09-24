/* eslint-disable @next/next/no-img-element */
import styles from '../../styles/Home.module.css';
import { auth, db } from '../firebase.js'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, collection, setDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuid } from 'uuid';

export default function Home() {
  const router = useRouter();
  const [user, loading, error] = useContext(AuthContext);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      if (user) {
        const usersRef = collection(db, 'users')
        const userDoc = doc(usersRef, user.uid)
        const currentUser = await getDoc(userDoc)
        if (!currentUser.exists()) {
          const chatId = uuid()
          await setDoc(doc(collection(db, 'chats'), chatId), {
            id: chatId,
            dm: true,
            users: [
              { id: 'O3WedIUzVpVdVOm3ZjNQ2vU3POq2', profilePicture: 'https://lh3.googleusercontent.com/a/ALm5wu2w18WVgbbbJDzDxWbNx7jjdWAGULfdMnU5li7v=s96-c', name: 'Usuário Teste' },
              { name: user.displayName, profilePicture: user.photoURL, id: user.uid }
            ],
            lastActive: Timestamp.now()
          })
          await setDoc(userDoc, {
            name: user.displayName,
            lowerCaseName: user.displayName.toLowerCase(),
            profilePicture: user.photoURL,
            chats: ['8EEMLBzTNJpcDMaDMyyr', chatId],
            friends: {
              O3WedIUzVpVdVOm3ZjNQ2vU3POq2: {
                id: 'O3WedIUzVpVdVOm3ZjNQ2vU3POq2',
                profilePicture: 'https://lh3.googleusercontent.com/a/ALm5wu2w18WVgbbbJDzDxWbNx7jjdWAGULfdMnU5li7v=s96-c',
                name: 'Usuário Teste'
              }
            }
          })
        }
      }
    }
    catch (error) {
      return
    }
  }

  useEffect(() => {
    if (user) {
      router.push('/chatroom')
    }
  }, [user, loading, router]);

  return (
    <div className={styles.container}>
      <div className={styles.introContainer}>
        <h1 className={styles.intro}>
          Sign in and start chatting with everyone!
        </h1>
        <button className={styles.signInBtn} onClick={handleSignIn}>
          <div className={styles.btnImageContainer}>
            <img src='/google.jpg' alt='google logo' />
          </div>
          <span >
            Sign in with google
          </span>
        </button>
      </div>
      <div className={styles.emojiContainer}>
        <img src='/smiley-emoji.png' alt='A smiling emoji' />
      </div>
    </div>
  )
}
