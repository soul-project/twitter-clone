import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
