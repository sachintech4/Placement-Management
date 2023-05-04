import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  View,
  ToggleButton,
  Button,
  Flex,
  Form,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import { AuthUserContext } from "../contexts";
import { updateEmail } from "@firebase/auth";
import { ToastQueue } from "@react-spectrum/toast";
import cons from "../cons";

function UpdateEmail() {
  const authUser = useContext(AuthUserContext);
  const [edit, setEdit] = useState(false);
  const [emailInput, setEmailInput] = useState(authUser.email);
  const [email, setEmail] = useState(authUser.email);

  useEffect(() => {
    if (authUser.email !== email) {
      setEmail(authUser.email);
      setEmailInput(authUser.email);
    }
  }, [authUser]);

  const handleEmailUpdate = async () => {
    try {
      await updateEmail(authUser.currentUser, emailInput);
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        // show a re-auth modal
      } else {
        console.error("failed to update email");
        console.error(error);
        ToastQueue.negative("Failed to udpate email", { timeout: 1000 });
      }
    }
  };
  const onToggleEdit = () => {
    setEdit((_edit) => {
      if (_edit) setEmailInput(email);
      return !_edit;
    });
  }

  return (
    <View
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
      padding={"size-150"}
    >
      <Form onSubmit={handleEmailUpdate}>
        <Flex direction={"column"} gap={"size-150"} alignItems={"start"}>
          <Flex alignItems={"end"}>
            <TextField
              label="Email"
              isReadOnly={!edit}
              value={emailInput}
              onChange={setEmailInput}
              type={"email"}
              width="size-3600"
              maxWidth="100%"
              marginEnd={"size-50"}
            />
            <ToggleButton
              onPress={onToggleEdit}
              aria-label="edit email"
              isSelected={edit}
            >
              <Edit />
            </ToggleButton>
          </Flex>
          {edit && (
            <Button variant="accent" type="submit">
              Update Email
            </Button>
          )}
        </Flex>
      </Form>
    </View>
  );
}

export default UpdateEmail;
