/* eslint-disable @next/next/no-img-element */
import styles from '../../styles/FriendRequest.module.css';
import { setDoc, arrayRemove, arrayUnion, collection, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuid } from 'uuid';

export default function FriendRequest({ request, currentUser }) {
    const handleAccept = async () => {
        const chatId = uuid()
        await setDoc(doc(collection(db, 'chats'), chatId), {
            id: chatId,
            dm: true,
            users: [
                request.from,
                { name: currentUser.name, profilePicture: currentUser.profilePicture, id: currentUser.id }
            ],
            lastActive: Timestamp.now()
        })
        await updateDoc(currentUser.ref, {
            [`friends.${request.from.id}`]: request.from,
            chats: arrayUnion(chatId),
            friendRequestsReceived: arrayRemove(request)
        })
        const sentRequest = { to: { name: currentUser.name, id: currentUser.id, profilePicture: currentUser.profilePicture } }
        await updateDoc(doc(collection(db, 'users'), request.from.id), {
            [`friends.${sentRequest.to.id}`]: sentRequest.to,
            chats: arrayUnion(chatId),
            friendRequestsSent: arrayRemove(sentRequest)
        })
    }

    const handleReject = async () => {
        await updateDoc(currentUser.ref, {
            friendRequestsReceived: arrayRemove(request)
        })
        const sentRequest = { to: { name: currentUser.name, id: currentUser.id, profilePicture: currentUser.profilePicture } }
        await updateDoc(doc(collection(db, 'users'), request.from.id), {
            friendRequestsSent: arrayRemove(sentRequest)
        })
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <img src={request.from.profilePicture} alt='user picture' style={{ width: 30, height: 30, borderRadius: '50%' }} />
                <span>{request.from.name}</span>
            </div>
            <div style={{ marginTop: '5px' }}>
                <button
                    className={styles.requestButton}
                    style={{ backgroundColor: 'green', marginRight: '5px' }}
                    onClick={handleAccept}
                >
                    Accept
                </button>
                <button
                    className={styles.requestButton}
                    style={{ backgroundColor: '#e33327' }}
                    onClick={handleReject}
                >
                    Reject
                </button>
            </div>
        </div>
    );
}