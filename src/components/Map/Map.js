import {
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { LocationOnOutlined } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import GoogleMapReact from "google-map-react";
import mapStyles from "./mapStyles";
import { useEffect } from "react";

const Map = ({
  setCoordinates,
  setBounds,
  coordinates,
  places,
  setChildClicked,
  weatherData,
  flixBusData,
}) => {
  const isDesktop = useMediaQuery("(min-width: 600px)");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  const handleChange = (e) => {
    setBounds({ ne: e.bounds.ne, sw: e.bounds.sw });
    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
  };

  return (
    <div style={mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => handleChange(e)}
        onChildClick={(child) => setChildClicked(child)}
      >
        {places?.map((place, i) => (
          <div
            key={i}
            style={markerContainer}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
          >
            {!isDesktop ? (
              <LocationOnOutlined color="primary" fontSize="small" />
            ) : (
              <Paper elevation={3} style={paper}>
                <Typography variant="subtitle2" gutterBottom>
                  {place.name}
                </Typography>
                <img
                  src={
                    place.photo
                      ? place.photo.images.large.url
                      : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                  }
                  alt={place.name}
                  style={pointer}
                />
                <Rating size="small" readOnly value={Number(place.rating)} />
              </Paper>
            )}
          </div>
        ))}
        {weatherData?.list?.map((data, i) => (
          <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
            <img
              src={`https://openweathermap.org/img/w/${data.weather[0].icon}.png`}
              alt={data.name}
              height={100}
            />
          </div>
        ))}
      </GoogleMapReact>
    </div>
  );
};

const paper = {
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "100px",
};
const mapContainer = {
  margin: "20px",
  height: "95vh",
  width: "100%",
};
const markerContainer = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  zIndex: 1,
  "&:hover": { zIndex: 2 },
};
const pointer = {
  cursor: "pointer",
};

export default Map;
