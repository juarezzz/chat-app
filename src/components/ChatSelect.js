/* eslint-disable @next/next/no-img-element */
import { useCallback } from 'react';
import styles from '../../styles/ChatSelect.module.css';

function ChatSelect({ chat, setCurrentChat, currentChat, user }) {
    const chatName = chat.dm
        ?
        chat.users.find(chatUser => chatUser.id !== user?.uid).name
        :
        chat.name

    const chatImage = chat.dm
        ?
        chat.users.find(chatUser => chatUser.id !== user?.uid).profilePicture
        :
        chat.image

    const handleClick = () => {
        setCurrentChat(chat.id);
    }

    const titleRef = useCallback((el) => {
        if (el) {
            el.onmouseenter = () => {
                if (el.clientWidth > el.parentElement.clientWidth) {
                    el.style.setProperty('--move-left', `${el.parentElement.clientWidth - el.clientWidth}px`)
                }
            }
            el.onmouseleave = () => {
                el.style.setProperty('--move-left', '0px')
            }
        }
    }, [])

    return (
        <div
            className={`${styles.container} ${chat.id === currentChat ? styles.selected : ''}`}
            onClick={handleClick}
        >
            {chatImage ?
                <img src={chatImage} alt='Chat Image' style={{ width: 35, height: 35, borderRadius: '50%' }} />
                :
                <div className={styles.iconImage}>
                    <div>
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                    </div>
                </div>
            }
            <div className={styles.chatTitle}>
                <span className={styles.titleText} ref={titleRef}>
                    {
                        chatName
                    }
                </span>
            </div>
        </div >
    );
}

export default ChatSelect;