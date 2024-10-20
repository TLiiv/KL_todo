import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Logout({setAccessToken}) {
  // TODO import user session store, extract logout function
  const navigate = useNavigate();

  useEffect(() => {
    // TODO run logout function to clear session token
    localStorage.removeItem('token');
    setAccessToken(null);
    navigate("/");
  }, [navigate,setAccessToken]);

  return null;
}