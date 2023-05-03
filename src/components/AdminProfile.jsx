import React, { useContext, useEffect, useState } from "react";
import { TextField, View } from "@adobe/react-spectrum";
import { AuthUserContext } from "../contexts";

function AdminProfile({ role }) {
  const [edit, setEdit] = useState(true);
  const authUser = useContext(AuthUserContext);

  // todo:
  // 1. on component mount: fetch the email from auth object and show it as the textfield value
  // 2. on authUser object change: repeat the 1.
  // 3. create and update button below the textfield
  // 4. onUpdateButtonClick set "edit" state to true (enabling changes to the textfield)
  // 5. onSubmit (press) send udpate email request.
 
  return (
    <View>
      <TextField label="Email" isReadOnly={edit} />
    </View>
  );
}

export default AdminProfile;
