import {
  Flex,
  Form,
  TextField,
  Menu,
  MenuTrigger,
  ActionButton,
  Item,
  Button,
  Grid,
  View,
  Image,
  Heading,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useState, useMemo } from "react";
import cons from "../cons.js";
import logo from "../assets/logo.png";

function LoginScreen() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [roleKey, setRoleKey] = useState(null);

  const users = useMemo(() => Object.values(cons.USERS), []);

  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !email.match(validRegex)) {
      ToastQueue.negative("Please provide a valid email address", {
        timeout: 1000,
      });
      return;
    }
    if (!password) {
      ToastQueue.negative("Please provide a password", { timeout: 1000 });
      return;
    }
    if (!roleKey) {
      ToastQueue.negative("Please provide a role", { timeout: 1000 });
      return;
    }

    const creds = {
      email,
      password,
      role: roleKey,
    };

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

      // todo:
      // 1. obtain the response.
      // 2. save the token or display error msg as per the response.
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
            <MenuTrigger>
              <ActionButton>
                {users.find((user) => user.type === roleKey)?.text ?? "Role"}
              </ActionButton>
              <Menu onAction={(key) => setRoleKey(key)} items={users}>
                {(user) => <Item key={user.type}>{user.text}</Item>}
              </Menu>
            </MenuTrigger>
            <Button type="submit">login</Button>
          </Form>
        </View>
      </Flex>
    </Grid>
  );
}

export default LoginScreen;
