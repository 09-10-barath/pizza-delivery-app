import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

axios.get(`${API_URL}/api/inventory`)
  .then(response => {
    console.log("API Response:", response.data);
  })
  .catch(error => {
    console.error("Error fetching inventory:", error.message);
  });
