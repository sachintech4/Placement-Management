import React, { useContext, useState, useEffect } from "react";
import { AuthUserContext } from "../contexts";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";
import {
  View,
  ToggleButton,
  TextField,
  Form,
  Button,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import Edit from "@spectrum-icons/workflow/Edit";

function TpoProfile() {
  const user = useContext(AuthUserContext);
  const [edit, setEdit] = useState(false);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [id, setId] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [dobInput, setDobInput] = useState({ day: "", month: "", year: "" });
  const [idInput, setIdInput] = useState("");
  const [contactNumberInput, setContactNumberInput] = useState("");

  const docRef = doc(db, cons.DB.COLLECTIONS.USERS_TPO, user.uid);

  // Get Tpo document using uid
  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setEmail(data.email);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDob(data.dob);
        setId(data.id);
        setContactNumber(data.contactNumber);

        // Sets value for the input field
        setFirstNameInput(data.firstName);
        setLastNameInput(data.lastName);
        setDobInput(data.dob);
        setIdInput(data.id);
        setContactNumberInput(data.contactNumber);
      } else {
        console.log("Document does not exist");
      }
    });

    return () => unsubscribe();
  }, [user.uid]);

  const updateTpoDocument = async (e) => {
    e.preventDefault();
    const updatedTpoData = {
      firstName: firstNameInput,
      lastName: lastNameInput,
      dob: {
        day: dobInput.day,
        month: dobInput.month,
        year: dobInput.year,
      },
      id: idInput,
      contactNumber: contactNumberInput,
    };

    try {
      await updateDoc(docRef, updatedTpoData);
      console.log("Tpo document updated successfully.");
    } catch (error) {
      console.error("Error updating Tpo data.");
    }
  };

  const onToggleEdit = () => {
    setEdit((_edit) => {
      if (_edit) {
        setFirstNameInput(firstName);
        setLastNameInput(lastName);
        setContactNumber(contactNumber);
        setIdInput(id);
        setDobInput(dob);
      }
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
      <Form onSubmit={updateTpoDocument}>
        <TextField
          label="First Name"
          isReadOnly={!edit}
          value={firstNameInput}
          onChange={setFirstNameInput}
        />
        <TextField
          label="Last Name"
          isReadOnly={!edit}
          value={lastNameInput}
          onChange={setLastNameInput}
        />
        <TextField
          label={edit ? "To update email look for Settings page." : "Email"}
          value={email}
        />
        <TextField
          label="Id"
          isReadOnly={!edit}
          value={idInput}
          onChange={setIdInput}
        />
        <View>
          <TextField
            label="Day"
            isReadOnly={!edit}
            value={dobInput.day}
            onChange={(value) => setDobInput({ ...dobInput, day: value })}
          />
          <TextField
            label="Month"
            isReadOnly={!edit}
            value={dobInput.month}
            onChange={(value) => setDobInput({ ...dobInput, month: value })}
          />
          <TextField
            label="Year"
            isReadOnly={!edit}
            value={dobInput.year}
            onChange={(value) => setDobInput({ ...dobInput, year: value })}
          />
        </View>
        <TextField
          label="Contact Number"
          isReadOnly={!edit}
          value={contactNumberInput}
          onChange={setContactNumberInput}
        />

        <ToggleButton
          onPress={onToggleEdit}
          aria-label="edit details"
          isSelected={edit}
        >
          <Edit />
        </ToggleButton>
        {edit && (
          <Button variant="accent" type="submit">
            Update
          </Button>
        )}
      </Form>
    </View>
  );
}

export default TpoProfile;
