function Popup({ children, handleClose }) {

    return (
        <div
            style={{
                backgroundColor: '#00000055',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
            }}
        >
            <button
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    right: '0px',
                    top: '-20px',
                    backgroundColor: 'transparent',
                    borderRadius: '50%',
                    border: 'none',
                    outline: 'none',
                    fontWeight: '700',
                    fontSize: '64px',
                    color: 'white',
                    cursor: 'pointer',
                    zIndex: 1000
                }}>
                <span>
                    &times;
                </span>
            </button>
            {children}
        </div>
    );
}

export default Popup;