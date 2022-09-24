import { useRouter } from "next/router"
import { useEffect } from "react";

export default function Custom404() {
    const router = useRouter()

    useEffect(() => {
        router.push('/')
    }, [router]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'var(--primary-color)',
                display: 'grid',
                placeItems: 'center'
            }}
        >
            <h1 style={{ textAlign: 'center' }}>There is nothing here!</h1>
        </div>
    )
}