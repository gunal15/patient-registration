import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import Registration from "./components/Registration";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
