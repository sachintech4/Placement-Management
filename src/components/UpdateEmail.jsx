import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  View,
  ToggleButton,
  Button,
  Flex,
  Form,
  DialogContainer,
} from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import { AuthUserContext } from "../contexts";
import { updateEmail } from "@firebase/auth";
import { ToastQueue } from "@react-spectrum/toast";
import ReauthDialog from "./ReauthDialog";
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function UpdateEmail({ role }) {
  const authUser = useContext(AuthUserContext);
  const [edit, setEdit] = useState(false);
  const [emailInput, setEmailInput] = useState(authUser.email);
  const [email, setEmail] = useState(authUser.email);
  const [showReauthDialog, setShowReauthDialog] = useState(false);

  const userRoleDocRefMap = {
    [cons.USERS.ADMIN.type]: cons.DB.COLLECTIONS.USERS_ADMIN,
    [cons.USERS.TPO.type]: cons.DB.COLLECTIONS.USERS_TPO,
    [cons.USERS.STUDENT.type]: cons.DB.COLLECTIONS.USERS_STUDENT,
  };

  const docRef = doc(db, userRoleDocRefMap[role.type], authUser.uid);

  useEffect(() => {
    if (authUser.email !== email) {
      setEmail(authUser.email);
      setEmailInput(authUser.email);
    }
  }, [authUser]);

  const updateEmailInDatabase = async (updatedEmail) => {
    try {
      await updateDoc(docRef, { email: updatedEmail });
      console.log("Email successfully updated in the document.");
    } catch (error) {
      console.error("Error updating Tpo email in database.");
      ToastQueue.negative("Failed to update email in the document.", {
        timeout: 1000,
      });
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (email === emailInput) {
      ToastQueue.negative("Please enter a new email address to update", {
        timout: 1000,
      });
      return;
    }
    ToastQueue.info("Please enter your password in order to proceed", {
      timeout: 1000,
    });
    setShowReauthDialog(true);
  };
  const onAuthSuccess = async () => {
    try {
      const { currentUser } = authUser.auth;
      await updateEmail(currentUser, emailInput);
      ToastQueue.positive("Your email has been reset", { timeout: 1000 });
      setEdit(false);
      if (role.type === "admin") {
        return;
      } else {
        updateEmailInDatabase(currentUser.email);
      }
    } catch (error) {
      console.error("failed to update email");
      console.error(error);
      ToastQueue.negative("Failed to udpate email", { timeout: 1000 });
      setEmailInput(email);
      setEdit(false);
    }
  };

  const onToggleEdit = () => {
    setEdit((_edit) => {
      if (_edit) setEmailInput(email);
      return !_edit;
    });
  };

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
      <DialogContainer onDismiss={() => setShowReauthDialog(false)}>
        {showReauthDialog && <ReauthDialog onSuccess={onAuthSuccess} />}
      </DialogContainer>
    </View>
  );
}

export default UpdateEmail;
