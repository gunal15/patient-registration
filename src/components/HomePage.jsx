import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
      title: "Modern Hospital Facilities",
    },
    {
      url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
      title: "Advanced Medical Care",
    },
    {
      url: "https://images.unsplash.com/photo-1516549655169-df83a0774514",
      title: "Dedicated Medical Staff",
    },
  ];

  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      experience: "15+ years of experience",
    },
    {
      name: "Dr. Michael Chen",
      specialization: "Neurologist",
      experience: "12+ years of experience",
    },
    {
      name: "Dr. Emily Williams",
      specialization: "Pediatrician",
      experience: "10+ years of experience",
    },
  ];

  const handleRegisterClick = () => {
    navigate("/registration"); // Change this line
  };
  const handleViewPatientsClick = () => {
    navigate("/patients"); // Change this line
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Carousel>
        {carouselImages.map((item, index) => (
          <Box
            key={index}
            sx={{
              height: "60vh",
              backgroundImage: `url(${item.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "white",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Carousel>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegisterClick}
        >
          Register
        </Button>
        &nbsp; &nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewPatientsClick}
        >
          View Patients
        </Button>
      </Box>
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Welcome to Our Hospital
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Providing exceptional healthcare services with state-of-the-art
          facilities and experienced medical professionals.
        </Typography>

        <Typography variant="h4" sx={{ mt: 6, mb: 4 }}>
          Our Expert Doctors
        </Typography>
        <Grid container spacing={4}>
          {doctors.map((doctor, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {doctor.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {doctor.specialization}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {doctor.experience}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
