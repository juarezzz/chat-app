import styles from '../../styles/AudioControls.module.css';
import { useCallback, useEffect, useState } from "react";
import formatTime from '../helpers/formatTime';

export default function AudioControls({ audioSrc, message }) {
    const speedRates = [1, 1.5, 2]
    const [speedRateIndex, setSpeedRateIndex] = useState(0)
    const [paused, setPaused] = useState(true);
    const [duration, setDuration] = useState(null)
    const [audio, setAudio] = useState(null);
    const [audioProgress, setAudioProgress] = useState(0);

    const changeSpeedRate = () => {
        const newSpeedRateIndex = ++speedRateIndex > speedRates.length - 1 ? 0 : speedRateIndex
        audio.playbackRate = speedRates[newSpeedRateIndex]
        setSpeedRateIndex(newSpeedRateIndex)
    }

    const currentTime = useCallback(el => {
        if (el) {
            el.textContent = formatTime(audioProgress);
        }
    }, [audioProgress]);

    const audioLength = useCallback(el => {
        if (el && duration) {
            el.textContent = formatTime(duration)
        }
    }, [duration])

    const audioSlider = useCallback(el => {
        if (el && duration) {
            el.max = duration
            audio.currentTime = 0
            audio.ontimeupdate = () => {
                setAudioProgress(audio.currentTime)
            }
            audio.onended = () => {
                setAudioProgress(0)
                setPaused(true)
            }
        }
    }, [audio, duration])

    const handlePlay = () => {
        audio.play()
        setPaused(false)
    }

    const handlePause = () => {
        audio.pause()
        setPaused(true)
    }

    const handleInput = (evt) => {
        audio.currentTime = evt.target.value
    }

    useEffect(() => {
        if (audioSrc) {
            const newAudio = new Audio();
            newAudio.preload = 'metadata';
            newAudio.src = audioSrc;
            //Correct a Chrome bug that sets audio duration to Infinity
            newAudio.addEventListener("durationchange", () => {
                if (newAudio.duration !== Infinity) {
                    const duration = newAudio.duration
                    newAudio.remove();
                    setDuration(duration);
                };
            });
            newAudio.load();
            newAudio.currentTime = 24 * 60 * 60;
            setAudio(newAudio);
            return () => {
                newAudio.src = null;
            }
        }
    }, [audioSrc])

    return (
        <div className={styles.audioControls} style={message && { width: '100%' }}>
            <input
                type='range'
                ref={audioSlider}
                value={audioProgress}
                onInput={handleInput}
                onMouseDown={handlePause}
                onMouseUp={handlePlay}
                className={styles.slider}
            />
            <div className={styles.time}>
                {
                    !message
                        ?
                        <span ref={currentTime}>0:00</span>
                        :
                        paused
                            ?
                            <span ref={audioLength}>0:00</span>
                            :
                            <span ref={currentTime}>0:00</span>
                }
            </div>
            <button
                className={styles.iconButton}
                onClick={paused ? handlePlay : handlePause}
            >
                <span className="material-symbols-outlined">
                    {
                        paused
                            ?
                            'play_arrow'
                            :
                            'pause'
                    }
                </span>
            </button>
            {
                message
                &&
                <span className={styles.speedRate} onClick={changeSpeedRate}>
                    {`${speedRates[speedRateIndex]}x`}
                </span>
            }
            {
                !message
                &&
                <span className={styles.duration} ref={audioLength}>0:00</span>
            }
        </div>
    );
}
