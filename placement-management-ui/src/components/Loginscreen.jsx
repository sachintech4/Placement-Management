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
import { useState } from "react";
import logo from "../assets/logo.png";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "") {
      ToastQueue.negative("Please provide an email", { timeout: 1000 });
      return;
    }
    if (password === "") {
      ToastQueue.negative("Please provide a password", { timeout: 1000 });
      return;
    }
    if (role === "") {
      ToastQueue.negative("Please provide a role", { timeout: 1000 });
      return;
    }
    console.log(email, password, role);
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
              <ActionButton>Role</ActionButton>
              <Menu onAction={(key) => setRole(key)}>
                <Item key="admin">Admin</Item>
                <Item key="tpo">TPO</Item>
                <Item key="student">Student</Item>
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
