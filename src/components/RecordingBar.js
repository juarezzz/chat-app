import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useCallback, useEffect, useState } from 'react';
import styles from '../../styles/RecordingBar.module.css';
import { storage } from '../firebase';
import AudioControls from './AudioControls';
import Loading from './Loading';
import { v4 as uuid } from 'uuid';
import formatTime from '../helpers/formatTime';

export default function RecordingBar({ stream, handleClose, handleSubmit }) {
    const [loading, setLoading] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audio, setAudio] = useState(null);
    const [audioData, setAudioData] = useState(null);
    const [reviewAudio, setReviewAudio] = useState(false);

    const showTime = useCallback((el) => {
        if (el) {
            let seconds = 0
            const interval = setInterval(() => {
                seconds++
                el.textContent = formatTime(seconds)
                if (reviewAudio) clearInterval(interval)
            }, 1000)
        }
    }, [reviewAudio])

    useEffect(() => {
        if (!mediaRecorder) {
            const chunks = [];
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (evt) => {
                chunks.push(evt.data);
            }
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/mp3' });
                setAudioData(blob)
                const url = URL.createObjectURL(blob);
                setAudio(url);
            }
            recorder.start();
            setMediaRecorder(recorder);
        }
        return () => {
            if (audio) URL.revokeObjectURL(audio)
        }
    }, [stream, audio, mediaRecorder])

    const handleStopRecording = () => {
        mediaRecorder.stop();
        setReviewAudio(true);
    }

    const handleUploadAudio = async () => {
        setLoading(true)
        const audioMessageRef = ref(storage, `audioMessages/${uuid()}.mp3`)
        await uploadBytes(audioMessageRef, audioData, { contentType: 'audio/mpeg' })
        const url = await getDownloadURL(audioMessageRef)
        handleSubmit(url)
        handleClose()
    }

    return (
        <div className={styles.recordingBar}>
            {
                loading
                    ?
                    <Loading diameter={25} thickness={3} color={'black'} />
                    :
                    reviewAudio
                        ?
                        <div className={styles.reviewAudio}>
                            <AudioControls audioSrc={audio} />
                            <div className={styles.reviewAudioButtons}>
                                <button type='button' className={styles.iconButton} onClick={handleUploadAudio}>
                                    <span className='material-symbols-outlined' style={{ fontSize: 32 }} >
                                        send
                                    </span>
                                </button>
                                <button type='button' className={styles.iconButton} onClick={handleClose}>
                                    <span className='material-symbols-outlined' style={{ fontSize: 32 }}>
                                        delete
                                    </span>
                                </button>
                            </div>
                        </div>
                        :
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                                <span className={`${styles.micIcon} material-symbols-outlined`}>
                                    mic
                                </span>
                                <span ref={showTime} style={{fontSize: '18px', fontWeight: 600}}>0:00</span>
                            </div>
                            <button type='button' className={styles.iconButton} onClick={handleStopRecording}>
                                <span className={`${styles.stopIcon} material-symbols-outlined`}>
                                    stop
                                </span>
                            </button>
                        </>
            }
        </div>
    )
}