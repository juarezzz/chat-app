import styles from '../../styles/Requests.module.css';
import useUser from "../hooks/useUser";
import FriendRequest from './FriendRequest';

export default function Requests() {
    const [currentUser, loading, error] = useUser()

    return (
        <div className={styles.container}>
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Friend requests</h2>
            {
                (currentUser && currentUser.friendRequestsReceived?.length > 0)
                    ?
                    currentUser.friendRequestsReceived.map(request => (
                        <FriendRequest key={request.from.id} request={request} currentUser={currentUser} />
                    ))
                    :
                    <div>
                        <h3 style={{ textAlign: 'center', lineHeight: '350px', userSelect: 'none' }}>You have no friend requests! </h3>
                    </div>
            }
        </div>
    );
}