import React, { useContext, useState, useEffect } from "react";
import { AuthUserContext } from "../contexts";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";
import {
  View,
  ToggleButton,
  TextField,
  Form,
  Button,
  Grid,
  Flex,
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

  const handleContactNumber = (inputValue) => {
    const numericInput = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    const maxDigits = 10;
    const limitedInput = numericInput.slice(0, maxDigits); // Limit to 10 digits
    setContactNumberInput(limitedInput);
  };

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
      // id: idInput,
      contactNumber: contactNumberInput,
    };

    try {
      await updateDoc(docRef, updatedTpoData);
      console.log("Tpo document updated successfully.");
      ToastQueue.positive("Document updated successfully.", { timeout: 1000 });
    } catch (error) {
      console.error("Error updating Tpo data.");
      ToastQueue.negative("Failed to update the document.", { timeout: 1000 });
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
      padding="size-250"
      width="fit-content"
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
      backgroundColor="gray-200"
    >
      <Form onSubmit={updateTpoDocument}>
        <Grid
          areas={[
            "firstName lastName",
            "email email",
            "id dob",
            "contactNumber contactNumber",
            "toggle submit",
          ]}
          columns={"1fr 1fr"}
          gap={"size-200"}
        >
          <TextField
            gridArea={"firstName"}
            label="First Name"
            isReadOnly={!edit}
            value={firstNameInput === null ? "" : firstNameInput}
            onChange={setFirstNameInput}
          />
          <TextField
            gridArea={"lastName"}
            label="Last Name"
            isReadOnly={!edit}
            value={lastNameInput === null ? "" : lastNameInput}
            onChange={setLastNameInput}
          />
          <TextField
            gridArea={"email"}
            label={
              edit ? "To update email, look for the Settings page." : "Email"
            }
            value={email}
            isReadOnly
          />
          <TextField
            gridArea={"id"}
            label="Id"
            isReadOnly={!edit}
            value={idInput === null ? "" : idInput}
            onChange={setIdInput}
          />
          <Flex gridArea={"dob"} alignitems={"end"} gap={"size-400"}>
            <TextField
              label="Day"
              isReadOnly={!edit}
              value={dobInput.day === null ? "" : dobInput.day}
              width={"size-200"}
              onChange={(value) => setDobInput({ ...dobInput, day: value })}
            />
            <TextField
              label="Month"
              isReadOnly={!edit}
              value={dobInput.month === null ? "" : dobInput.month}
              width={"size-200"}
              onChange={(value) => setDobInput({ ...dobInput, month: value })}
            />
            <TextField
              label="Year"
              isReadOnly={!edit}
              value={dobInput.year === null ? "" : dobInput.year}
              width={"size-800"}
              onChange={(value) => setDobInput({ ...dobInput, year: value })}
            />
          </Flex>
          <TextField
            gridArea={"contactNumber"}
            label="Contact Number"
            isReadOnly={!edit}
            value={contactNumberInput === null ? "" : contactNumberInput}
            onChange={(e) => handleContactNumber(e)}
          />
          <View gridArea={"toggle"} justifySelf={"center"}>
            <ToggleButton
              onPress={onToggleEdit}
              aria-label="edit details"
              isSelected={edit}
            >
              <Edit />
            </ToggleButton>
          </View>
          {edit && (
            <View gridArea={"submit"} justifySelf={"center"}>
              <Button variant="cta" type="submit">
                Update
              </Button>
            </View>
          )}
        </Grid>
      </Form>
    </View>
  );
}

export default TpoProfile;
