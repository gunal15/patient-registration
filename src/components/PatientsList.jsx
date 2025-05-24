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
} from "@mui/material";
import {
  Person,
  Cake,
  LocalHospital,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";

const PatientsList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const db = usePGlite();
  const [isDbReady, setIsDbReady] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const localPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    setPatients(localPatients);
  }, []);

  useEffect(() => {
    const initDb = async () => {
      if (!db) return;

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      <Grid container spacing={3}>
        {patients && patients.length > 0 ? (
          patients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                      {patient.name}
                    </Typography>
                    <Chip
                      label={patient.gender}
                      size="small"
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Cake sx={{ mr: 1, verticalAlign: "middle" }} />
                      Age: {patient.age}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      <LocalHospital sx={{ mr: 1, verticalAlign: "middle" }} />
                      Doctor: {patient.selectedDoctor}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Phone sx={{ mr: 1, verticalAlign: "middle" }} />
                      {patient.contactNumber}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <LocationOn sx={{ mr: 1, mt: 0.25 }} />
                      {patient.address}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        p: 1,
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                        borderRadius: 1,
                      }}
                    >
                      Cause: {patient.cause}
                    </Typography>
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
            <Typography variant="h6">No patients registered yet</Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default PatientsList;
