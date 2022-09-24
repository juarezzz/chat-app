import styles from '../../styles/PersonSearch.module.css';
import { query, collection, getDocs, orderBy, startAt, endAt } from 'firebase/firestore'
import { db } from '../firebase';
import { useState } from 'react';
import { userConverter } from '../helpers/firebaseConverters';
import SendRequest from './SendRequest';
import useUser from '../hooks/useUser';

export default function PersonSearch() {
    const [users, setUsers] = useState(null)
    const [searchString, setSearchString] = useState('')
    const [currentUser, loading] = useUser()

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!searchString.trim()) return
        const lowerCaseName = searchString.toLowerCase().trim();
        const q = query(
            collection(db, 'users').withConverter(userConverter),
            orderBy('lowerCaseName'),
            startAt(lowerCaseName),
            endAt(`${lowerCaseName}\uf8ff`)
        )
        const querySnapshot = await getDocs(q)
        const usersData = []
        querySnapshot.forEach(user => {
            usersData.push(user.data())
        })
        setUsers(usersData)
    }

    return (
        <div className={styles.container}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Search for people</h2>
            <form onSubmit={handleSubmit} className={styles.searchForm}>
                <input autoFocus className={styles.searchInput} value={searchString} onChange={({ target }) => setSearchString(target.value)} />
                <button className={styles.searchButton}>
                    <span className="material-symbols-outlined">
                        search
                    </span>
                </button>
            </form>
            {
                (users && !loading && currentUser)
                &&
                (
                    users.length > 0
                        ?
                        users.map(user => {
                            if (user.id !== currentUser.id) return (
                                <SendRequest
                                    key={user.id}
                                    user={user}
                                    currentUser={currentUser}
                                    alreadyFriends={currentUser.friends?.[user.id]}
                                    alreadySent={currentUser.friendRequestsSent?.find(
                                        request => request.to.id === user.id
                                    )}
                                    alreadyReceived={currentUser.friendRequestsReceived?.find(
                                        request => request.from.id === user.id
                                    )}
                                />
                            )
                        })
                        :
                        <h3 style={{ textAlign: 'center', marginTop: '10px' }}>No results found.</h3>
                )
            }
        </div>
    );
}
