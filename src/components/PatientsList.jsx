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
import { usePGlite } from "@electric-sql/pglite-react";

const PatientsList = () => {
  const db = usePGlite();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [patientData, setPatientData] = useState([]);

  const getAllPatients = async () => {
    console.log(db);
    // let patients = localStorage.getItem("patients");
    const ret = await db.query(`
      SELECT * from patients;
    `);
    console.log(ret.rows);
    // if (ret) {
    //   setPatientData(JSON.parse(ret));
    //   return JSON.parse(localStorage.getItem("patients"));
    // } else {
    //   return [];
    // }
  };

  useEffect(() => {
    getAllPatients();
  }, [db]);

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
        {patientData.map((patient) => (
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
        ))}
      </Grid>

      {patientData.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6">No patients registered yet</Typography>
        </Box>
      )}
    </Container>
  );
};

export default PatientsList;
