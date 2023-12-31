import { useEffect, useState } from "react";
import Screen from "./Screen";
import Axios from "axios";
import { Grid, Container, Skeleton, Typography } from "@mui/material";

export default function Screens({ listOfScreen, setListOfScreen }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await Axios.get("http://localhost:3000/screens", {
          headers,
        });

        setListOfScreen(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching screens:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [setListOfScreen]);

  return (
    <Container>
      <Typography
        variant="h3"
        align="center"
        style={{
          color: "#1e366a", // #333
          fontWeight: "bold",
          marginTop: "2rem",
        }}
      >
        List of Screens
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} lg={3}>
                <Skeleton variant="rectangular" height="18vh" />
              </Grid>
            ))
          : listOfScreen.map((screen) => (
              <Grid item key={screen._id} xs={12} sm={6} lg={3}>
                <Screen
                  key={screen._id}
                  screen={screen}
                  listOfScreen={listOfScreen}
                  setListOfScreen={setListOfScreen}
                  style={{ height: "18vh" }}
                />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
}
