import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, erroInfo) {
        console.log({ error, erroInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    backgroundColor: 'var(--primary-color)',
                    display: 'grid',
                    placeItems: 'center'
                }}
                >
                    <div>
                        <h1 style={{ fontSize: 36 }}>Oops! Something went wrong!</h1>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            style={{
                                height: '50px',
                                lineHeight: '50px',
                                color: 'white',
                                outline: 'none',
                                border: 'none',
                                width: '50%',
                                display: 'block',
                                margin: '10px auto',
                                borderRadius: '50vw',
                                cursor: 'pointer',
                                backgroundColor: 'var(--accent-color)',
                                fontSize: '22px',
                                fontWeight: '700'
                            }}
                        >
                            Go back
                        </button>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary;
