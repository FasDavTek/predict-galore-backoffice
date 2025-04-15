// pages/_app.js
import "@/styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import { wrapper } from "@/store/wrapper";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/themes/theme";

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
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toaster position="top-center" />
            <Component {...props.pageProps} />
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </>
  );
}

export default App;
