import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer } from "@react-spectrum/toast";
import { lightTheme, Provider, ProgressCircle, Flex } from "@adobe/react-spectrum";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "./firebase-config";
import "./App.css";
import Dashboard from "./components/Dashboard";
import LoginScreen from "./components/LoginScreen";
import { AuthUserContext } from "./contexts";

function App() {
  const [isLoading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user)
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });

    () => {
      unsubscribe();
    }
  }, []);

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <Flex height={"100%"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
          <ProgressCircle aria-label="loading..." size={"L"} isIndeterminate />
        </Flex>
      );
    }
    if (authUser) {
      return <Dashboard />;
    } else {
      return <LoginScreen />
    }
  }, [isLoading, authUser]);

  return (
    <Provider
      theme={lightTheme}
      colorScheme="light"
      height={"100vh"}
      width={"100vw"}
    >
      <AuthUserContext.Provider value={authUser}>
        {renderContent()}
        <ToastContainer />
      </AuthUserContext.Provider>
    </Provider>
  );
}

export default App;
