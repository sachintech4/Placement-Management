import {
  Flex,
  Form,
  TextField,
  Button,
  Grid,
  View,
  Image,
  Heading,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useState } from "react";
import cons from "../cons.js";
import logo from "../assets/logo.png";

function LoginScreen() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !email.match(cons.REGEXS.VALID_EMAIL)) {
      ToastQueue.negative("Please provide a valid email address", {
        timeout: 1000,
      });
      return;
    }
    if (!password) {
      ToastQueue.negative("Please provide a password", { timeout: 1000 });
      return;
    }

    const creds = { email, password };

    try {
      const url = `${cons.BASE_SERVER_URL}/auth`;
      const opts = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creds),
      };
      const res = await fetch(url, opts);
      const resJSON = await res.json();
      console.log(resJSON);
    } catch (error) {
      console.error(":: error authenticating user ::");
      console.error(error);
    }
  };

  return (
    <Grid
      areas={{
        base: ["logo", "form"],
        S: ["logo", "form"],
        M: ["logo form"],
        L: ["logo form"],
      }}
      rows={{ M: ["100vh"] }}
      columns={{ L: ["1fr", "1fr"] }}
      gap={{ base: "size-400" }}
    >
      <Flex
        gridArea="logo"
        direction={{ M: "column" }}
        justifyContent="center"
        alignItems="center"
      >
        <View
          width={{ base: "size-900", S: "size-2000", M: "size-3400" }}
          height="auto"
        >
          <Image src={logo} alt="TIMSCDR Logo"></Image>
        </View>
        <Heading level={1}>Placement Manager</Heading>
      </Flex>
      <Flex gridArea="form" justifyContent="center" alignItems="center">
        <View
          maxidth={{ base: "size-2500", L: "size:4600" }}
          borderWidth="thin"
          borderColor="dark"
          borderRadius="medium"
          padding="size-250"
        >
          <Form onSubmit={handleLogin}>
            <Flex direction={"column"} gap="size-200">
              <TextField
                label="Email"
                type="email"
                onChange={setEmail}
                isRequired
              />
              <TextField
                label="Password"
                type="password"
                onChange={setPassword}
                isRequired
              />
              <Button type="submit">login</Button>
            </Flex>
          </Form>
        </View>
      </Flex>
    </Grid>
  );
}

export default LoginScreen;
