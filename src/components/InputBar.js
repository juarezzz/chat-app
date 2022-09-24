import styles from '../../styles/InputBar.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { collection, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import RecordingBar from './RecordingBar';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import Loading from './Loading';

export default function InputBar({ user, chatBottom, currentChat }) {
    const [uploading, setUploading] = useState(false)
    const [notification, setNotification] = useState('')
    const [audioStream, setAudioStream] = useState(null)
    const [audioRecording, setAudioRecording] = useState(false)
    const [text, setText] = useState('')
    const input = useRef('')

    useEffect(() => {
        input.current?.focus()
    }, [currentChat, audioRecording]);

    const notificationMessage = useCallback((el) => {
        if (el) {
            el.textContent = notification
        }
    }, [notification])


    const handleGetStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            setAudioStream(stream)
            setAudioRecording(true)
        } catch (e) {
            alert('Allow access to microphone to send audio messages')
        }
    }

    const handleKeyDown = (evt => {
        switch (evt.code) {
            case 'Enter':
                evt.preventDefault();
                handleSubmitText();
                break;
        }
    })

    const handleInputChange = ({ target }) => {
        if (target.value.length < 5000) {
            setText(target.value)
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
        }
    }

    const handleSubmitText = async (evt) => {
        evt && evt.preventDefault()
        if (text.trim()) {
            setText('')
            input.current.style.height = "auto";
            await addDoc(collection(db, `chats/${currentChat}/messages`), {
                userId: user.uid,
                username: user.displayName,
                profilePicture: user.photoURL,
                content: text,
                sendAt: Timestamp.now(),
            })
            updateDoc(doc(collection(db, 'chats'), currentChat), {
                lastActive: Timestamp.now()
            })
            chatBottom.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleSubmitAudioMessage = async (audioURL) => {
        await addDoc(collection(db, `chats/${currentChat}/messages`), {
            userId: user.uid,
            username: user.displayName,
            profilePicture: user.photoURL,
            content: audioURL,
            audioMessage: true,
            sendAt: Timestamp.now(),
        })
        updateDoc(doc(collection(db, 'chats'), currentChat), {
            lastActive: Timestamp.now()
        })
        chatBottom.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSubmitImage = async ({ target }) => {
        const image = target.files[0]
        target.value = null
        if (!image) return
        const [type, imageType] = image.type.split('/')
        if (type !== 'image') return setNotification('File must be an image!')
        if (image.size > 8388608) return setNotification('Image is too large!')
        setUploading(true)
        const imageRef = ref(storage, `images/${uuid()}.${imageType}`)
        await uploadBytes(imageRef, image, { contentType: image.type })
        const imageURL = await getDownloadURL(imageRef)
        await addDoc(collection(db, `chats/${currentChat}/messages`), {
            userId: user.uid,
            username: user.displayName,
            profilePicture: user.photoURL,
            content: imageURL,
            image: true,
            sendAt: Timestamp.now(),
        })
        updateDoc(doc(collection(db, 'chats'), currentChat), {
            lastActive: Timestamp.now()
        })
        setUploading(false)
        chatBottom.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <form onSubmit={handleSubmitText} className={styles.messageForm}>
            {
                notification
                &&
                <div
                    ref={notificationMessage}
                    className={styles.notification}
                    onAnimationEnd={() => setNotification('')}
                />
            }
            {
                audioRecording
                    ?
                    <RecordingBar
                        stream={audioStream}
                        handleSubmit={handleSubmitAudioMessage}
                        handleClose={() => setAudioRecording(false)}
                    />
                    :
                    <>
                        {
                            uploading
                                ?
                                <Loading diameter={30} thickness={4} color='black' />
                                :
                                <label htmlFor='imageInput' className={styles.imageInputLabel}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                                        add_photo_alternate
                                    </span>
                                </label>
                        }
                        <input id='imageInput' type='file' accept='image/*' hidden onChange={handleSubmitImage} />
                        <button className={styles.barButton} type="button" onClick={handleGetStream}>
                            <span className='material-symbols-outlined' style={{ fontSize: 32 }}>
                                mic
                            </span>
                        </button>
                        <textarea
                            ref={input}
                            rows={1}
                            type="text"
                            className={styles.messageInput}
                            value={text}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button className={styles.barButton} type="submit">
                            <span className='material-symbols-outlined' style={{ fontSize: 32 }}>
                                send
                            </span>
                        </button>
                    </>
            }
        </form >
    );
}