import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import { chatConverter } from "../helpers/firebaseConverters"
import useUser from "./useUser"

const useChats = () => {
    const [userInfo] = useUser()
    const [chats, setChats] = useState({})
    const [subscriptions, setSubscriptions] = useState([])

    useEffect(() => {
        if (userInfo && userInfo.chats) {
            while (userInfo.chats.length) {
                const batch = userInfo.chats.splice(0, 10)
                const q = query(
                    collection(db, 'chats').withConverter(chatConverter),
                    where('id', 'in', batch)
                )
                const subscription = onSnapshot(q, (querySnapshot) => {
                    const chats = {}
                    querySnapshot.docs.forEach(doc => chats[doc.id] = doc.data())
                    setChats(prev => { return { ...prev, ...chats } })
                })
                setSubscriptions(prev => [...prev, subscription])
            }
        }
        return () => {
            subscriptions.forEach(unsubscribe => unsubscribe())
        }
    }, [subscriptions, userInfo]);

    return Object.values(chats)

}

export default useChats;