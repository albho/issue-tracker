import { createTheme } from "@mui/material/styles";
import { lightBlue, blueGrey, green, red } from "@mui/material/colors";

const baseTheme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  primary: {
    main: lightBlue.A700,
  },
  secondary: {
    main: blueGrey.A100,
  },
  success: {
    main: green.A700,
  },
  error: {
    main: red.A700,
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    background: {
      default: "#000",
      paper: "#111",
    },
    text: {
      primary: "#fff",
      secondary: "#eee",
    },
    primary: {
      main: lightBlue.A700,
    },
    secondary: {
      main: blueGrey.A100,
    },
    success: {
      main: green.A700,
    },
    error: {
      main: red.A700,
    },
  },
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    background: {
      default: "#eee",
      paper: "#fff",
    },
    text: {
      primary: "#000",
      secondary: "#111",
    },
    primary: {
      main: lightBlue[900],
    },
    secondary: {
      main: blueGrey[900],
    },
    success: {
      main: green[900],
    },
    error: {
      main: red[900],
    },
  },
});
