/* eslint-disable @next/next/no-img-element */
import { v4 as uuid } from 'uuid'
import { arrayUnion, collection, doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/CreateGroup.module.css';
import { db, storage } from '../firebase';
import useUser from "../hooks/useUser";
import Loading from './Loading';

export default function CreateGroup({ handleClose }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [creating, setCreating] = useState(false)
    const [previewImage, setPreviewImage] = useState(null);
    const [currentUser, loading] = useUser()
    const [name, setName] = useState('')
    const createButton = useRef()
    const imageError = useRef()

    useEffect(() => {
        !loading && currentUser && setSelectedUsers(selectedUsers => [...selectedUsers, currentUser.id])
    }, [currentUser, loading]);

    const handleToggle = ({ target }) => {
        if (target.checked) {
            createButton.current.disabled = false
            setSelectedUsers(selectedUsers => [...selectedUsers, target.value])
        } else {
            if (selectedUsers.length <= 2) createButton.current.disabled = true
            setSelectedUsers(selectedUsers => selectedUsers.filter(user => user !== target.value))
        }
    }

    const handleFileChange = ({ target }) => {
        const image = target.files[0]
        target.value = null
        if (!image) return
        const [type, imageType] = image.type.split('/')
        if (type !== 'image') return imageError.current.textContent = 'File must be an image!'
        if (image.size > 8388608) return imageError.current.textContent = 'Image file is too large!'
        previewImage && URL.revokeObjectURL(previewImage.imageURL)
        const imageURL = URL.createObjectURL(image)
        setPreviewImage({ image, imageURL, imageType })
        imageError.current.textContent = ''
    }

    const handleCreateGroup = async (evt) => {
        evt.preventDefault();
        if (creating) return
        if (!name.trim()) {
            evt.target.groupName.classList.add(styles.invalid)
            return
        }
        setCreating(true)
        evt.target.groupName.classList.remove(styles.invalid)
        const chatId = doc(collection(db, 'chats')).id
        const newChat = {
            name,
            id: chatId,
            lastActive: Timestamp.now()
        }
        if (previewImage) {
            const imageRef = ref(storage, `images/${uuid()}.${previewImage.imageType}`)
            await uploadBytes(imageRef, previewImage.image, { contentType: `image/${previewImage.imageType}` })
            const imageURL = await getDownloadURL(imageRef)
            newChat.image = imageURL
        }
        await setDoc(doc(collection(db, 'chats'), chatId), newChat)
        const usersRef = collection(db, 'users')
        selectedUsers.forEach(user => {
            updateDoc(doc(usersRef, user), {
                chats: arrayUnion(chatId)
            })
        })
        setCreating(false)
        handleClose()
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleCreateGroup} style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Create a new group</h2>
                <div className={styles.nameInputContainer}>
                    <input
                        type='text'
                        id='groupName'
                        name='groupName'
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                        className={styles.nameInput}
                        maxLength={50}
                    />
                    <label
                        htmlFor='groupName'
                    >
                        Group name:
                    </label>
                </div>
                <div style={{ flexGrow: 1, overflowY: 'auto', marginTop: '8px' }}>
                    {
                        (!loading && (!currentUser?.friends || currentUser.friends.length === 0))
                        &&
                        <h3 style={{ textAlign: 'center', margin: '30px 0' }}>Add some friends to create a group!</h3>
                    }
                    {
                        (!loading && currentUser?.friends)
                        &&
                        Object.keys(currentUser.friends).map(friendId => (
                            <div key={friendId} className={styles.friendSelect}>
                                <label htmlFor={friendId} style={{ flexGrow: 1, cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <img
                                            style={{ width: 30, height: 30, borderRadius: '50%' }}
                                            src={currentUser.friends[friendId].profilePicture}
                                            alt='Friend profile picture'
                                        />
                                        <span>
                                            {currentUser.friends[friendId].name}
                                        </span>
                                    </div>
                                </label>
                                <input
                                    hidden
                                    type='checkbox'
                                    id={friendId}
                                    name='friends'
                                    value={friendId}
                                    onChange={handleToggle}
                                    className={styles.checkbox}
                                />
                                <span className={`${styles.checkMark} material-symbols-outlined`}>
                                    check
                                </span>
                            </div>
                        ))
                    }
                </div>
                <div className={styles.imageUploadContainer}>
                    <input
                        id='imageUpload'
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={handleFileChange}
                    />
                    <label htmlFor='imageUpload' className={styles.inputFileLabel}>
                        Upload Group Image
                    </label>
                    {
                        previewImage
                        &&
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={previewImage.imageURL} alt='Group image to be uploaded' style={{ width: 35, height: 35, borderRadius: '50%' }} />
                            <span className="material-symbols-outlined" onClick={() => setPreviewImage(null)} style={{ cursor: 'pointer' }}>
                                delete
                            </span>
                        </div>
                    }
                </div>
                <span ref={imageError} style={{ color: 'crimson', fontWeight: 700, fontSize: 14 }}></span>
                <button ref={createButton} disabled className={styles.createButton}>
                    {
                        creating
                            ?
                            <Loading diameter={12} thickness={3} />
                            :
                            'Create Group'
                    }
                </button>
            </form>
        </div>
    );
}