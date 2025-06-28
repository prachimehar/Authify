import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppConstants } from "../util/contants";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true; // Enable sending cookies with requests
  const BASE_URL = AppConstants.BASE_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserData(response.data);
        setIsLoggedIn(true);
      } else {
        toast.error("Unable to retrieve profile.");
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      getUserData();
    }
  }, [isLoggedIn]);
  
  const getAuthState = async () => {
    try {
      const response = await axios.get(BASE_URL+ "/is-authenticated");
      if (response.status === 200 && response.data === true) {
        setIsLoggedIn(true);
        await getUserData();
      }
      else{
        setIsLoggedIn(false);
      }
    }
    catch (error) {
      if(error.response){
        console.error(error);
      }
    }

  }

  useEffect(() => {
    getAuthState();
  }, []);

  const contextValue = {
    BASE_URL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
