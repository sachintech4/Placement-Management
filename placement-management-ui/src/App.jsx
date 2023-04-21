import { ToastContainer } from "@react-spectrum/toast";
import { Button, lightTheme, Provider } from "@adobe/react-spectrum";

import "./App.css";
import LoginScreen from "./components/Loginscreen";

function App() {
  return (
    <Provider
      theme={lightTheme}
      colorScheme="light"
      height={"100vh"}
      width={"100vw"}
    >
      <LoginScreen />
      <ToastContainer />
    </Provider>
  );
}

export default App;
