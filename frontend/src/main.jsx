import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReviewsProvider } from "./context/ReviewsContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ReviewsProvider>
      <App />
    </ReviewsProvider>
  </ThemeProvider>
);


// db password DbUgZBvNNi4rIa18