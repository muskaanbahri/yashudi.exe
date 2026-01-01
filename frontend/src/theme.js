import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#E7D7C1", // warm pastel base
      paper: "#FFFFFF",
    },
    primary: {
      main: "#8C1C13", // teasing wine pink
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#A78A7F", // dusty rose
    },
    text: {
      primary: "#735751", // warm charcoal
      secondary: "#8F7B72",
    },
  },

  typography: {
  fontFamily: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,

  h6: {
    fontWeight: 600,
  },

  body1: {
    fontSize: "1.05rem",   // bigger than default
    lineHeight: 1.7,       // very readable
    fontWeight: 500,
  },

  body2: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },

  overline: {
    letterSpacing: "0.08em",
    fontWeight: 500,
  },
},


  shape: {
    borderRadius: 10, // soft but confident
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid rgba(115, 87, 81, 0.15)",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundColor: "#E7D7C1",
          color: "#735751",
          borderBottom: "1px solid rgba(115, 87, 81, 0.2)",
        },
      },
    },
  },
});

export default theme;
