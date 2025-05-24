import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Person,
  Cake,
  LocalHospital,
  Phone,
  LocationOn,
  Home,
} from "@mui/icons-material";
import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import Loader from "./Loader";

const PatientsList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const db = usePGlite();
  const [isDbReady, setIsDbReady] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    setPatients(localPatients);
  }, []);

  useEffect(() => {
    const initDb = async () => {
      if (!db) return;
      setIsLoading(true);
      try {
        await db.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            cause TEXT NOT NULL,
            selectedDoctor TEXT NOT NULL,
            contactNumber TEXT NOT NULL,
            address TEXT NOT NULL
          );
        `);
        setIsDbReady(true);
      } catch (error) {
        console.error("Error initializing database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initDb();
  }, [db]);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!isDbReady || !db) return;

      try {
        const result = await db.query(`
          SELECT * FROM patients 
          ORDER BY name ASC
        `);

        const localPatients = JSON.parse(
          localStorage.getItem("patients") || "[]"
        );

        const mergedPatients = [...localPatients];

        result.rows.forEach((dbPatient) => {
          const existingIndex = mergedPatients.findIndex(
            (p) => p.id === dbPatient.id
          );
          if (existingIndex === -1) {
            mergedPatients.push(dbPatient);
          } else {
            mergedPatients[existingIndex] = dbPatient;
          }
        });

        localStorage.setItem("patients", JSON.stringify(mergedPatients));
        setPatients(mergedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [isDbReady, db]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isLoading && <Loader />}
      <Container maxWidth="lg" sx={{ py: 4, position: "relative" }}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            left: { xs: 16, sm: 24 },
            top: { xs: 16, sm: 24 },
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <Home />
        </IconButton>

        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 600,
            color: theme.palette.primary.main,
            textAlign: "center",
          }}
        >
          Registered Patients
        </Typography>

        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              p: 1,
              width: { xs: "100%", sm: "80%", md: "60%" },
            }}
          >
            <Search sx={{ color: "text.secondary", mr: 1 }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "1rem",
                  "&::placeholder": {
                    color: "text.secondary",
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filteredPatients && filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Grid item xs={12} sm={6} md={6} lg={6} key={patient.id}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
                    transition: "all 0.3s ease-in-out",
                    border: "1px solid rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
                      background:
                        "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2.5 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                          fontSize: "1.25rem",
                        }}
                      >
                        <Person
                          sx={{
                            mr: 1.5,
                            fontSize: 28,
                            color: theme.palette.primary.main,
                          }}
                        />
                        {patient.name}
                      </Typography>
                      <Chip
                        label={patient.gender}
                        size="small"
                        color="primary"
                        sx={{
                          mt: 1.5,
                          borderRadius: "12px",
                          textTransform: "capitalize",
                          fontWeight: 500,
                          px: 1,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        "& .info-row": {
                          display: "flex",
                          alignItems: "center",
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: "rgba(0,0,0,0.02)",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.04)",
                          },
                        },
                      }}
                    >
                      <Typography variant="body2" className="info-row">
                        <Cake
                          sx={{ mr: 1.5, color: theme.palette.secondary.main }}
                        />
                        Age: {patient.age}
                      </Typography>

                      <Typography variant="body2" className="info-row">
                        <LocalHospital
                          sx={{ mr: 1.5, color: theme.palette.error.main }}
                        />
                        {patient.selectedDoctor}
                      </Typography>

                      <Typography variant="body2" className="info-row">
                        <Phone
                          sx={{ mr: 1.5, color: theme.palette.success.main }}
                        />
                        {patient.contactNumber}
                      </Typography>

                      <Typography
                        variant="body2"
                        className="info-row"
                        sx={{
                          alignItems: "flex-start !important",
                        }}
                      >
                        <LocationOn
                          sx={{
                            mr: 1.5,
                            mt: 0.5,
                            color: theme.palette.warning.main,
                          }}
                        />
                        {patient.address}
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            p: 2,
                            bgcolor: "rgba(0, 0, 0, 0.03)",
                            borderRadius: 3,
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
                          }}
                        >
                          <strong>Cause:</strong> {patient.cause}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6">
                {searchQuery
                  ? "No patients found matching your search"
                  : "No patients registered yet"}
              </Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default PatientsList;
