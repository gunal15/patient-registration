import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { PGlite } from "@electric-sql/pglite";
import HomePage from "./components/HomePage";
import Registration from "./components/Registration";
import { ToastContainer } from "react-toastify";
import PatientsList from "./components/PatientsList";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { PGliteProvider } from "@electric-sql/pglite-react";

const db = await PGlite.create({
  extensions: { live },
});
const theme = createTheme();
function App() {
  // const db = new PGlite();
  return (
    <ThemeProvider theme={theme}>
      <PGliteProvider db={db}>
        <ToastContainer />
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/patients" element={<PatientsList />} />
          </Routes>
        </BrowserRouter>
      </PGliteProvider>
    </ThemeProvider>
  );
}

export default App;
