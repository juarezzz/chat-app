import '../../styles/globals.css'
import ErrorBoundary from '../components/ErrorBoundary'
import AuthProvider from '../context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default MyApp
