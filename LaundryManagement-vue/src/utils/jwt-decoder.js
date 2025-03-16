import { jwtDecode } from "jwt-decode";

export const jwtDecoder = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.log("Failed to decode token", error);
    return null;
  }
};

export default jwtDecoder;
