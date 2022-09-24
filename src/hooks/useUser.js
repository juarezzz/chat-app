import { collection, doc } from "firebase/firestore";
import { useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { userConverter } from "../helpers/firebaseConverters";

const useUser = () => {
    const [user, loading, error] = useContext(AuthContext)
    const userInfo = useDocumentData(
        (user && !loading) ?
            doc(collection(db, 'users').withConverter(userConverter), user.uid)
            :
            undefined
    )
    return userInfo;
}

export default useUser;