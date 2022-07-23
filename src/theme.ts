import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    border: { gray: "#2F3336" },
    linkPreview: { background: "#171c26" },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
