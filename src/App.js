import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { PGlite } from "@electric-sql/pglite";
import HomePage from "./components/HomePage";
import Registration from "./components/Registration";
import { ToastContainer } from "react-toastify";

const theme = createTheme();

function App() {
  // const db = new PGlite();
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
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
