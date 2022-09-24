import styles from '../../styles/Chatroom.module.css'
import Chat from '../components/Chat';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router'
import ChatList from '../components/ChatList';
import Navbar from '../components/Navbar';

export default function Chatroom() {
    const [user, loading, error] = useContext(AuthContext);
    const router = useRouter();
    const [currentChat, setCurrentChat] = useState(null)

    useEffect(() => {
        if (!user && !loading) {
            router.push('/')
        }
    }, [user, loading, router]);

    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <Navbar />
                <Chat user={user} currentChat={currentChat} />
            </div>
            <div className={styles.rightSide}>
                <ChatList setCurrentChat={setCurrentChat} currentChat={currentChat} user={user} />
            </div>
        </div>
    );
}
