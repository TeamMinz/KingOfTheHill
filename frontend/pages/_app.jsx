/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
