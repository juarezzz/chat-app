import styles from '../../styles/Chat.module.css';
import { collection, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db, storage } from '../firebase'
import { messageConverter } from '../helpers/firebaseConverters'
import ChatMessage from './ChatMessage';
import InputBar from './InputBar';
import { useEffect, useRef } from 'react';
import Loading from './Loading';
import { deleteObject, ref } from 'firebase/storage';

export default function Chat({ user, currentChat }) {
    const q = query(collection(db, `chats/${currentChat}/messages`).withConverter(messageConverter), orderBy('sendAt'))
    const [messages, loading, error] = useCollectionData(q)
    const chatBottom = useRef('')

    useEffect(() => {
        currentChat && !loading
            &&
            //Give some time for images to load before scrolling down
            setTimeout(() => chatBottom.current.scrollIntoView({ behavior: 'smooth' }), 300);
    }, [currentChat, loading]);

    const handleDeleteMessage = (message) => {
        if (message.image || message.audioMessage) {
            deleteObject(ref(storage, message.content))
        }
        deleteDoc(doc(collection(db, `chats/${currentChat}/messages`), message.id))

    }

    return (
        <div className={styles.chatBox}>
            {
                currentChat &&
                <>
                    {
                        loading
                        &&
                        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                            <Loading diameter={100} thickness={8} color='black' />
                        </div>
                    }
                    <div className={styles.messagesContainer}>
                        {
                            messages
                            &&
                            messages.map(message => (
                                <ChatMessage key={message.id} message={message} user={user} handleDelete={handleDeleteMessage} />
                            ))
                        }
                        <span ref={chatBottom} />
                    </div>
                    <InputBar user={user} chatBottom={chatBottom.current} currentChat={currentChat} />
                </>
            }
        </div>
    )
}