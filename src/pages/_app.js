// pages/_app.js
import "@/styles/globals.css"; 
import Head from 'next/head';
import { Provider } from 'react-redux'; 
import { wrapper } from '@/store/wrapper';
import { Toaster } from 'react-hot-toast'; 
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <>
    <Head>
    <title>Livescore Admin</title>
    <meta name="description" content="Prediction Galore" />
    {/* <link rel="icon" href="/favicon.ico" /> */}
  </Head>
     <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Provider store={store}>
      <Toaster position="top-center" />
      
      <Component {...props.pageProps} />
    </Provider>
    </ErrorBoundary>
    </>
  );
}


export default App;
