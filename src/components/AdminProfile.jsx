import React, { useContext, useEffect, useState } from "react";
import { TextField, View, ActionButton, Button } from "@adobe/react-spectrum";
import Edit from "@spectrum-icons/workflow/Edit";
import { AuthUserContext } from "../contexts";
import {
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "@firebase/auth";

function AdminProfile({ role }) {
  const authUser = useContext(AuthUserContext);
  const currentUser = authUser.auth.currentUser;

  const [edit, setEdit] = useState(true);
  const [email, setEmail] = useState(authUser.email);

  async function handleEmailUpdate() {
    // const credential = EmailAuthProvider.credential(email, currentPassword);
    // console.log(authUser);
    // try {
    //   await reauthenticateWithCredential(currentUser, credential);
    //   await updateEmail(currentUser, email);
    // } catch (error) {
    //   console.error(error);
    // }
  }

  // todo:
  // 1. on component mount: fetch the email from auth object and show it as the textfield value
  // 2. on authUser object change: repeat the 1.
  // 3. create and update button below the textfield
  // 4. onUpdateButtonClick set "edit" state to true (enabling changes to the textfield)
  // 5. onSubmit (press) send udpate email request.

  return (
    <View>
      <TextField
        label="Email"
        isReadOnly={edit}
        value={email}
        onChange={setEmail}
      />
      <ActionButton
        onPress={() => {
          setEdit(false);
        }}
      >
        <Edit />
      </ActionButton>
      <Button variant="accent" onPress={handleEmailUpdate}>
        Update Email
      </Button>
    </View>
  );
}

export default AdminProfile;
