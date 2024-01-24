import React, { createContext, useState } from "react";

export const authdata = createContext("");

const ContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  return (
    <authdata.Provider value={{ loggedIn, setLoggedIn, userId, setUserId }}>
      {children}
    </authdata.Provider>
  );
};

export default ContextProvider;
