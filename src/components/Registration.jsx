import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { usePGlite } from "@electric-sql/pglite-react";
import { useLiveQuery } from "@electric-sql/pglite-react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const db = usePGlite();
  const navigate = useNavigate();
  // const db = new PGlite();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [isDbReady, setIsDbReady] = useState(false);
  const doctors = [
    { name: "Dr. Sarah Johnson", specialization: "Cardiologist" },
    { name: "Dr. Michael Chen", specialization: "Neurologist" },
    { name: "Dr. Emily Williams", specialization: "Pediatrician" },
  ];
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
        toast.error("Failed to initialize database");
      }
    };

    initDb();
  }, [db]);
  const [patientData, setPatientData] = useState({
    id: uuidv4(),
    name: "",
    age: "",
    gender: "",
    cause: "",
    selectedDoctor: "",
    contactNumber: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) {
      console.error("Database not initiated");
      return;
    }

    try {
      await db.query(
        `INSERT INTO patients (id, name, age, gender, cause, selectedDoctor, contactNumber, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          patientData.id,
          patientData.name,
          parseInt(patientData.age),
          patientData.gender,
          patientData.cause,
          patientData.selectedDoctor,
          patientData.contactNumber,
          patientData.address,
        ]
      );

      const existingPatients = JSON.parse(
        localStorage.getItem("patients") || "[]"
      );
      existingPatients.push(patientData);
      localStorage.setItem("patients", JSON.stringify(existingPatients));

      setPatientData({
        id: uuidv4(),
        name: "",
        age: "",
        gender: "",
        cause: "",
        selectedDoctor: "",
        contactNumber: "",
        address: "",
      });

      toast.success("Patient registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error registering patient:", error);
      toast.error("Failed to register patient");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          align="center"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main,
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          Patient Registration
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <TextField
            fullWidth
            label="Patient Name"
            name="name"
            value={patientData.name}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 2, md: 3 },
            }}
          >
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={patientData.age}
              onChange={handleChange}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <FormControl
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={patientData.gender}
                label="Gender"
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Cause of Visit"
            name="cause"
            multiline
            rows={isMobile ? 2 : 3}
            value={patientData.cause}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <FormControl
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          >
            <InputLabel>Select Doctor</InputLabel>
            <Select
              name="selectedDoctor"
              value={patientData.selectedDoctor}
              label="Select Doctor"
              onChange={handleChange}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.name} value={doctor.name}>
                  {doctor.name} - {doctor.specialization}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={patientData.contactNumber}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            multiline
            rows={isMobile ? 2 : 3}
            value={patientData.address}
            onChange={handleChange}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: { xs: 2, sm: 3 },
              mb: { xs: 1, sm: 2 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              },
            }}
          >
            Register Patient
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Registration;
