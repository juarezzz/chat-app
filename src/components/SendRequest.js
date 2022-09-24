/* eslint-disable @next/next/no-img-element */
import styles from '../../styles/SendRequest.module.css'
import { updateDoc, arrayUnion } from 'firebase/firestore';
import { useState } from 'react';
import Loading from './Loading';

export default function SendRequest({ user, currentUser, alreadyFriends, alreadySent, alreadyReceived }) {
    const [loading, setLoading] = useState(false)

    const handleFriendRequest = async () => {
        const friendRequestSent = {
            to: {
                id: user.id,
                name: user.name,
                profilePicture: user.profilePicture
            }
        }
        const friendRequestReceived = {
            from: {
                id: currentUser.id,
                name: currentUser.name,
                profilePicture: currentUser.profilePicture
            }
        }
        setLoading(true)
        await updateDoc(currentUser.ref, {
            friendRequestsSent: arrayUnion(friendRequestSent)
        })
        await updateDoc(user.ref, {
            friendRequestsReceived: arrayUnion(friendRequestReceived)
        })
        setLoading(false)
    }

    const requestStatus = () => {
        if (alreadyFriends) {
            return (
                <div className={styles.requestButton} style={{ backgroundColor: 'green', cursor: 'default' }}>
                    <span>Your Friend</span>
                </div>
            )
        } else if (alreadySent) {
            return (
                <div className={styles.requestButton} style={{ backgroundColor: '#E24E29', cursor: 'default' }}>
                    <span>Request Sent</span>
                </div>
            )
        } else if (alreadyReceived) {
            return (
                <div className={styles.requestButton} style={{ backgroundColor: '#337b97', cursor: 'default' }}>
                    <span>Request Received</span>
                </div>
            )
        } else {
            return (
                <button className={styles.requestButton} onClick={handleFriendRequest}>
                    {
                        loading
                            ?
                            <Loading diameter={18} thickness={3} />
                            :
                            <span>Send Friend Request</span>
                    }
                </button>
            )
        }
    }


    return (
        <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <img src={user.profilePicture} alt='userPicture' style={{ width: 30, height: 30, borderRadius: '50%' }} />
                <span>{user.name}</span>
            </div>
            {requestStatus()}
        </div >
    );
}