import React, { useState, useEffect } from "react";
import { ToastContainer } from "@react-spectrum/toast";
import { lightTheme, Provider } from "@adobe/react-spectrum";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase-config";
import "./App.css";
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import { AuthUserContext } from "./contexts";

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    () => {
      unsubscribe();
    }
  }, []);

  return (
    <Provider
      theme={lightTheme}
      colorScheme="light"
      height={"100vh"}
      width={"100vw"}
    >
      <AuthUserContext.Provider value={authUser}>
        {authUser ? <Dashboard /> : <LoginScreen />}
        <ToastContainer />
      </AuthUserContext.Provider>
    </Provider>
  );
}

export default App;

// todo: show loading screen on first load while firebase checks for auth in the background