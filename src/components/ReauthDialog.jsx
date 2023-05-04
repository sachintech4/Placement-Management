import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Heading,
  Form,
  TextField,
  Flex,
  useDialogContainer,
  ActionButton,
} from "@adobe/react-spectrum";
import Visibility from "@spectrum-icons/workflow/Visibility";
import VisibilityOff from "@spectrum-icons/workflow/VisibilityOff";
import { EmailAuthProvider } from "@firebase/auth";
import { ToastQueue } from "@react-spectrum/toast";
import { reauthenticateWithCredential } from "@firebase/auth";
import { AuthUserContext } from "../contexts";
import cons from "../cons";

function ReauthDialog({ onSuccess }) {
  const dialog = useDialogContainer();
  const authUser = useContext(AuthUserContext);
  const [email, setEmail] = useState(authUser.email);
  const [emailInput, setEmailInput] = useState(authUser.email);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (email !== authUser.email) {
      setEmail(authUser.email);
      setEmailInput(authUser.email);
    }
  }, [authUser]);

  const reAuth = async (e) => {
    if (emailInput === "") {
      ToastQueue.negative("Please provide an Email", { timeout: 1000 });
      return
    }
    if (!emailInput.match(cons.REGEXS.VALID_EMAIL)) {
      ToastQueue.negative("Please provide a valid Email", { timeout: 1000 });
      return;
    }
    if (password === "") {
      ToastQueue.negative("Please provide a Password", { timeout: 1000 });
      return;
    }
    try {
      const { currentUser } = authUser.auth;
      const credential = EmailAuthProvider.credential(emailInput, password);
      await reauthenticateWithCredential(currentUser, credential);
      console.log("re-authenticated successfully");
      ToastQueue.positive("You were re-authenticated successfully", {
        timeout: 1000,
      });
      onSuccess();
      dialog.dismiss();
    } catch (error) {
      console.error("failed to reauthenticate the user");
      console.error(error);
      ToastQueue.negative("Failed to Re-authneticate, try again after some time", {
        timeout: 1000,
      });
    }
  }

  return (
    <Dialog>
      <Heading>Re-authenticate</Heading>
      <Divider />
      <Content>
        <Flex direction={"column"} gap="size-200" alignItems={"start"}>
          <TextField
            label="Email"
            type="email"
            onChange={setEmailInput}
            isRequired
            isReadOnly={email}
            value={email ? email : emailInput}
            name={"email"}
          />
          <Flex gap={"size-50"} alignItems={"end"}>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              isRequired
              name={"password"}
              value={password}
              onChange={setPassword}
            />
            <ActionButton onPress={() => {
              setShowPassword((show) => !show);
            }}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </ActionButton>
          </Flex>
        </Flex>
      </Content>
      <ButtonGroup>
        <Button variant="secondary" onPress={dialog.dismiss}>
          Cancel
        </Button>
        <Button variant="accent" onPress={reAuth}>
          Submit
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

export default ReauthDialog;
