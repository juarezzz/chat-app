/* eslint-disable @next/next/no-img-element */
import styles from '../../styles/ChatMessage.module.css';
import AudioControls from './AudioControls';
import Popup from './Popup';
import { useCallback, useRef, useState } from 'react';
import formatDate from '../helpers/formatDate';
import Loading from './Loading';

function ChatMessage({ message, user, handleDelete }) {
    const [loadingImage, setLoadingImage] = useState(true);
    const [bigText, setBigText] = useState(false)
    const [fullImage, setFullImage] = useState(false);
    const imageContainer = useRef(null)
    const messageText = useCallback((el) => {
        if (el && el.clientHeight > 300) {
            setBigText(true)
            el.style.maxHeight = '250px'
        }
    }, [])

    console.log(loadingImage)

    const handleSeeMore = ({ target }) => {
        target.parentElement.style.maxHeight = 'fit-content'
        setBigText(false)
    }

    let content
    if (message.audioMessage) {
        content = (
            <AudioControls audioSrc={message.content} message />
        )
    } else if (message.image) {
        content = (
            <div className={styles.imageMessage} ref={imageContainer}>
                <img
                    src={message.content}
                    alt='User sent image'
                    loading='lazy'
                    onClick={() => setFullImage(true)}
                    style={{ cursor: 'pointer', margin: '0 auto' }}
                    onLoad={({ target }) => {
                        //Max width and height of 500px
                        let { naturalWidth, naturalHeight } = target
                        while (naturalWidth > 500 || naturalHeight > 500) {
                            naturalWidth /= 2
                            naturalHeight /= 2
                        }
                        imageContainer.current.style.width = `${naturalWidth}px`
                        imageContainer.current.style.height = `${naturalHeight}px`
                        setLoadingImage(false)
                    }}
                />
                {loadingImage && <Loading diameter={40} thickness={6} color='black' />}
            </div>
        )
    } else {
        content = (
            <p
                ref={messageText}
                className={styles.textMessage}
            >
                {message.content}
                {
                    bigText
                    &&
                    <span className={styles.seeMore} onClick={handleSeeMore}>
                        See more
                    </span>
                }
            </p>
        )
    }

    return (
        <div className={`${styles.messageContainer} ${message.userId === user?.uid ? styles.sent : styles.received}`}>
            <div className={styles.chatMessage}>
                <div className={styles.messageHeader}>
                    <img className={styles.profilePicture} alt='profile picture' src={message.profilePicture} />
                    <span>{message.userId === user?.uid ? 'You' : message.username}</span>
                    {
                        message.userId === user?.uid
                        &&
                        <button
                            style={{
                                outline: 'none',
                                border: 'none',
                                backgroundColor: 'transparent',
                                marginLeft: 'auto',
                                height: '30px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleDelete(message)}
                        >
                            <span>
                                <span className="material-symbols-outlined" style={{ fontSize: 20, lineHeight: '30px' }}>
                                    delete
                                </span>
                            </span>
                        </button>
                    }
                </div>
                <div className={styles.messageContent}>
                    {content}
                    <span className={styles.sentTime}>
                        {formatDate(message.sendAt)}
                    </span>
                </div>
            </div>
            {
                fullImage
                &&
                <Popup handleClose={() => setFullImage(false)}>
                    <div style={{ width: '95%', height: '95%', position: 'relative' }}>
                        <img className={styles.fullImage} src={message.content} alt='An image' objectFit='scale-down' />
                    </div>
                </Popup>
            }
        </div>
    );
}

export default ChatMessage;
