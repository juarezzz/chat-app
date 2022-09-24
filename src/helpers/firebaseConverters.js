export const messageConverter = {
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ref: snapshot.ref,
            ...data,
            sendAt: data.sendAt.toDate(),
        };
    },
};

export const chatConverter = {
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            ref: snapshot.ref,
            ...data,
            lastActive: data.lastActive.toDate()
        }
    }
}

export const userConverter = {
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            ref: snapshot.ref,
            ...data
        }
    }
}