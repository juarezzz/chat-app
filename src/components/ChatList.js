import { useEffect, useState } from 'react';
import styles from '../../styles/ChatList.module.css';
import useChats from '../hooks/useChats';
import ChatSelect from './ChatSelect';
import Loading from './Loading';

export default function ChatList({ setCurrentChat, currentChat, user }) {
    const chats = useChats();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (chats.length) setLoading(false);
    }, [chats])

    return (
        <div className={styles.container}>
            {
                loading
                &&
                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Loading diameter={75} thickness={8} />
                </div>
            }

            {
                chats
                &&
                chats.sort((a, b) => b.lastActive - a.lastActive).map(chat => (
                    <ChatSelect key={chat.id} chat={chat} setCurrentChat={setCurrentChat} currentChat={currentChat} user={user} />
                ))
            }
        </div>
    );
}