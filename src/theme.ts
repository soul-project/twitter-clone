import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    border: {
      gray: "#2F3336",
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
