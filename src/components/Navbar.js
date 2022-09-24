import { signOut } from 'firebase/auth';
import styles from '../../styles/Navbar.module.css';
import { auth } from '../firebase';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import Popup from './Popup';
import Requests from './Requests';
import PersonSearch from './PersonSearch';
import CreateGroup from './CreateGroup';
import useUser from '../hooks/useUser';

export default function Navbar() {
    const router = useRouter()
    const [user, loading] = useUser();
    const [searchPopup, setSearchPopup] = useState(false);
    const [requestsPopup, setRequestsPopup] = useState(false);
    const [createGroupPopup, setCreateGroupPopup] = useState(false);

    const friendRequestsCount = useCallback(el => {
        if (el && !loading && user && user.friendRequestsReceived) {
            user.friendRequestsReceived.length === 0 ? el.style.setProperty('display', 'none') : el.style.setProperty('display', 'block');
            const count = user.friendRequestsReceived.length < 10 ? user.friendRequestsReceived.length : '9+'
            el.textContent = count 
        }
    }, [loading, user])

    const handleSignOut = () => {
        router.push('/');
        signOut(auth);
    }

    return (
        <nav className={styles.navbar}>
            <button className={styles.logoutButton} onClick={handleSignOut}>
                Log Out
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                <button className={styles.iconButton} onClick={() => setSearchPopup(true)}>
                    <span className="material-symbols-outlined">
                        person_search
                    </span>
                </button>
                <button className={styles.iconButton} onClick={() => setRequestsPopup(true)}>
                    <span className="material-symbols-outlined">
                        group_add
                    </span>
                    <span ref={friendRequestsCount} className={styles.friendRequestsCount} />
                </button>
                <button className={styles.iconButton} onClick={() => setCreateGroupPopup(true)}>
                    <span className="material-symbols-outlined">
                        chat_add_on
                    </span>
                </button>
            </div>
            {
                requestsPopup
                &&
                <Popup handleClose={() => setRequestsPopup(false)}>
                    <Requests />
                </Popup>
            }
            {
                searchPopup
                &&
                <Popup handleClose={() => setSearchPopup(false)}>
                    <PersonSearch />
                </Popup>
            }
            {
                createGroupPopup
                &&
                <Popup handleClose={() => setCreateGroupPopup(false)}>
                    <CreateGroup handleClose={() => setCreateGroupPopup(false)} />
                </Popup>
            }
        </nav >
    );
}