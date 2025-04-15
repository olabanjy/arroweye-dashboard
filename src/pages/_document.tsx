import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Studio | Arroweye Pro</title>
        <meta name="title" content="Studio | Arroweye Pro" />
        <meta
          name="description"
          content="We empower independent artists and labels with data to grow their revenue."
        />

        <meta property="og:type" content="Studio | Arroweye Pro" />
        <meta property="og:url" content="https://studio.arroweye.pro/" />
        <meta property="og:title" content="Studio | Arroweye Pro" />
        <meta property="og:description" content="We empower independent artists and labels with data to grow their revenue." />
        <meta property="og:image" content="https://res.cloudinary.com/dih0krdcj/image/upload/v1739434295/Arroweye%20Pro/gprcom6jx4iunr6jyu7o.jpg" />

        <meta property="twitter:card" content="Studio | Arroweye Pro" />
        <meta property="twitter:url" content="https://studio.arroweye.pro/" />
        <meta property="twitter:title" content="Studio | Arroweye Pro" />
        <meta property="twitter:description" content="We empower independent artists and labels with data to grow their revenue." />
        <meta property="twitter:image" content="https://res.cloudinary.com/dih0krdcj/image/upload/v1739434295/Arroweye%20Pro/gprcom6jx4iunr6jyu7o.jpg" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@mdi/font@7.1.96/css/materialdesignicons.min.css"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
