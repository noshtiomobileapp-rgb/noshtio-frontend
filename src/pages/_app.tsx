import type { AppProps } from "next/app";
import Head from "next/head";

// ✅ CORRECT PATH (based on your repo)
import "../../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
