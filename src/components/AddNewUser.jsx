import React, { useState } from "react";
import {
  Item,
  TabList,
  TabPanels,
  Tabs,
  Form,
  TextField,
  MenuTrigger,
  Menu,
  ActionButton,
  DatePicker,
  Grid,
  Button,
  View,
  Flex,
  Divider,
  Heading,
} from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import UserAdd from "@spectrum-icons/workflow/UserAdd";
import { ToastQueue } from "@react-spectrum/toast";
import cons from "../cons";
import useTpos from "../hooks/useTpos";
import useStudents from "../hooks/useStudents";

function AddTpo() {
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);
  const tpos = useTpos();
  const [file, setFile] = useState(null);
  const [id, setID] = useState("");

  const handleIdInput = (inputValue) => {
    const numericInput = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (/^[0-9]+$/.test(numericInput)) {
      setID(numericInput);
    } else if (numericInput === "") {
      setID("");
    } else {
      // Ignore the input if it's not a number
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const firstName = data.get("first-name").trim();
    const lastName = data.get("last-name").trim();
    const email = data.get("email").trim();
    // const id = data.get("id-number").trim();

    // todo: input sanitsation and validation
    const details = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      id: id,
      gender: gender,
      dob: dob,
      role: "tpo",
    };

    // validation
    if (!details.firstName) {
      ToastQueue.negative("Please provide the First Name", { timeout: 1000 });
      return;
    }
    if (!details.lastName) {
      ToastQueue.negative("Please provide the Last Name", { timeout: 1000 });
      return;
    }
    if (!details.email) {
      ToastQueue.negative("Please provide the Email", { timeout: 1000 });
      return;
    }
    if (!details.email.match(cons.REGEXS.VALID_EMAIL)) {
      if (!details.email.includes("@")) {
        ToastQueue.negative("@ is missing from the email address", {
          timeout: 1000,
        });
        return;
      } else {
        ToastQueue.negative("Please provide a valid Email", { timeout: 1000 });
        return;
      }
    }

    if (!details.id) {
      ToastQueue.negative("Please provide the ID number", { timeout: 1000 });
      return;
    }
    if (!details.gender) {
      ToastQueue.negative("Please provide the gender", { timeout: 1000 });
      return;
    }
    if (!details.dob) {
      ToastQueue.negative("Please provide the Date of birth", {
        timeout: 1000,
      });
      return;
    }
    // Check if ID already exists in TPO array
    const isIdExists = tpos.some((tpo) => tpo.id === id);
    if (isIdExists) {
      ToastQueue.negative("ID already exists", { timeout: 1000 });
      return;
    }

    // send a post request to create the user
    try {
      const opts = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      };
      const res = await fetch(`${cons.BASE_SERVER_URL}/users`, opts);
      const resJson = await res.json();
      if (res.ok) {
        ToastQueue.positive(`${resJson.message}`, {
          timeout: 1000,
        });
        // Clear the form by resetting the state values
        setGender(null);
        setDob(null);
        setID("");
        form.reset(); // Reset the form fields
      } else {
        throw { code: resJson.code, message: resJson.message };
      }
    } catch (error) {
      console.error(error);

      if (error.code === "email-already-exists") {
        ToastQueue.negative(error.message, { timeout: 1000 });
      } else {
        ToastQueue.negative("error creating the new TPO user", {
          timeout: 1000,
        });
      }
    }
  };

  const handleMultipleTpoAddition = async () => {
    try {
      const response = await fetch(`${cons.BASE_SERVER_URL}/addMultipleTpos`, {
        method: "POST",
        body: file,
      });

      if (response.ok) {
        ToastQueue.positive("Users: TPO added successfully.", {
          timeout: 1000,
        });
        setFile(null);
      } else {
        // Handle error response
        console.error("Error uploading file");
      }
    } catch (error) {
      // Handle fetch error
      console.error("Fetch error:", error);
    }
  };

  return (
    <Flex direction="row" alignItems="start" gap={"size-200"}>
      <View
        padding="size-250"
        width="fit-content"
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
      >
        <Form onSubmit={handleSubmit} isRequired>
          <Grid
            areas={[
              "first-name last-name",
              "email email",
              "gender dob",
              "id-no id-no",
              "buttons buttons",
            ]}
            columns={"1fr 1fr"}
            alignItems={"end"}
            gap={"size-200"}
          >
            <TextField
              label="First Name"
              gridArea={"first-name"}
              name="first-name"
            />
            <TextField
              label="Last Name"
              gridArea={"last-name"}
              name="last-name"
            />
            <TextField
              label="Email"
              gridArea={"email"}
              width="100%"
              name="email"
            />
            <TextField
              label="ID"
              gridArea={"id-no"}
              name="id-number"
              value={id}
              onChange={(e) => {
                handleIdInput(e);
              }}
            />
            <MenuTrigger gridArea={"gender"}>
              <ActionButton>{gender || "Select Gender"}</ActionButton>
              <Menu onAction={(key) => setGender(key)}>
                <Item key="male">Male</Item>
                <Item key="female">Female</Item>
              </Menu>
            </MenuTrigger>
            <DatePicker
              label="Date of birth"
              gridArea={"dob"}
              value={dob}
              maxValue={parseDate("2005-01-01")}
              onChange={setDob}
            />
            <View gridArea={"buttons"}>
              <Button type="submit">Register</Button>
            </View>
          </Grid>
        </Form>
      </View>

      <Divider orientation="vertical" size="M" />

      <View
        padding="size-250"
        width="fit-content"
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
      >
        <Grid
          columns={["1fr", "1fr"]}
          rows={["size-500", "size-500"]}
          areas={["heading heading", "inputField inputField", "upload upload"]}
        >
          <View gridArea={"heading"} width="fit-content">
            <Heading level={4}>
              Upload an Excel sheet to add multiple TPO at once.
            </Heading>
          </View>
          <View gridArea={"inputField"}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </View>
          {file && (
            <View gridArea={"upload"}>
              <Button onPress={handleMultipleTpoAddition}>Upload</Button>
            </View>
          )}
        </Grid>
      </View>
    </Flex>
  );
}

function AddStudent() {
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);
  const [file, setFile] = useState(null);
  const students = useStudents();
  const [prn, setPrn] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [batch, setBatch] = useState("");

  const handlePrnInput = (inputValue) => {
    const numericInput = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (/^[0-9]+$/.test(numericInput)) {
      setPrn(numericInput);
    } else if (numericInput === "") {
      setPrn("");
    } else {
      // Ignore the input if it's not a number
    }
  };

  const handleRollNoInput = (inputValue) => {
    const numericInput = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (/^[0-9]+$/.test(numericInput)) {
      setRollNo(numericInput);
    } else if (numericInput === "") {
      setRollNo("");
    } else {
      // Ignore the input if it's not a number
    }
  };

  const handleBatchInput = (inputValue) => {
    const numericInput = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (/^[0-9]+$/.test(numericInput)) {
      setBatch(numericInput);
    } else if (numericInput === "") {
      setBatch("");
    } else {
      // Ignore the input if it's not a number
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const firstName = data.get("first-name").trim();
    const lastName = data.get("last-name").trim();
    const email = data.get("email").trim();
    // const prn = data.get("prn-number").trim();
    // const rollNo = data.get("roll-no").trim();
    // const batch = data.get("batch").trim();

    const details = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      prn: prn.trim(),
      rollNo: rollNo.trim(),
      gender: gender,
      dob: dob,
      role: "student",
      batch: batch.trim(),
    };

    // validation
    if (!details.firstName) {
      ToastQueue.negative("Please provide the First Name", { timeout: 1000 });
      return;
    }
    if (!details.lastName) {
      ToastQueue.negative("Please provide the Last Name", { timeout: 1000 });
      return;
    }
    if (!details.email) {
      ToastQueue.negative("Please provide the Email", { timeout: 1000 });
      return;
    }
    if (!details.email.match(cons.REGEXS.VALID_EMAIL)) {
      if (!details.email.includes("@")) {
        ToastQueue.negative("@ is missing from the email address", {
          timeout: 1000,
        });
        return;
      } else {
        ToastQueue.negative("Please provide a valid Email", { timeout: 1000 });
        return;
      }
    }
    if (!details.prn) {
      ToastQueue.negative("Please provide the PRN number", { timeout: 1000 });
      return;
    }
    if (!details.rollNo) {
      ToastQueue.negative("Please provide the Roll number", { timeout: 1000 });
      return;
    }
    if (!details.gender) {
      ToastQueue.negative("Please provide the gender", { timeout: 1000 });
      return;
    }
    if (!details.dob) {
      ToastQueue.negative("Please provide the Date of birth", {
        timeout: 1000,
      });
      return;
    }

    if (!details.batch) {
      ToastQueue.negative("Please provide the batch", { timeout: 1000 });
      return;
    }

    if (
      isNaN(details.batch) ||
      details.batch < 2000 ||
      details.batch > new Date().getFullYear()
    ) {
      ToastQueue.negative("Please enter a valid batch", { timeout: 1000 });
      return;
    }
    const isRollNoExists = students.some(
      (student) => student.rollNo === rollNo
    );
    if (isRollNoExists) {
      ToastQueue.negative("Roll no. already exists", { timeout: 1000 });
      return;
    }
    const isPrnExists = students.some((student) => student.prn === prn);
    if (isPrnExists) {
      ToastQueue.negative("PRN already exists", { timeout: 1000 });
      return;
    }

    // send a post request to create the user
    try {
      const opts = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      };
      const res = await fetch(`${cons.BASE_SERVER_URL}/users`, opts);
      const resJson = await res.json();

      if (res.ok) {
        ToastQueue.positive(`${resJson.message}`, {
          timeout: 1000,
        });
        // Clear the form by resetting the state values
        setGender(null);
        setDob(null);
        setPrn("");
        setRollNo("");
        setBatch("");
        form.reset(); // Reset the form fields
      } else {
        throw { code: resJson.code, message: resJson.message };
      }
    } catch (error) {
      console.error(error);

      if (error.code === "email-already-exists") {
        ToastQueue.negative(error.message, { timeout: 1000 });
      } else {
        ToastQueue.negative("error creating the new Student user", {
          timeout: 1000,
        });
      }
    }
  };

  const handleMultipleStudentAddition = async () => {
    try {
      const response = await fetch(
        `${cons.BASE_SERVER_URL}/addMultipleStudents`,
        {
          method: "POST",
          body: file,
        }
      );

      if (response.ok) {
        ToastQueue.positive("Users: Students added successfully.", {
          timeout: 1000,
        });
        setFile(null);
      } else {
        // Handle error response
        console.error("Error uploading file");
      }
    } catch (error) {
      // Handle fetch error
      console.error("Fetch error:", error);
    }
  };

  return (
    <Flex direction="row" alignItems="start" gap={"size-200"}>
      <View
        padding="size-250"
        width="fit-content"
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
      >
        <Form onSubmit={handleSubmit} isRequired>
          <Grid
            areas={[
              "first-name last-name",
              "email email",
              "prn-no roll-no",
              "gender dob",
              "batch batch",
              "buttons buttons",
            ]}
            columns={"1fr 1fr"}
            alignItems={"end"}
            gap={"size-200"}
          >
            <TextField
              label="First Name"
              gridArea={"first-name"}
              name="first-name"
            />
            <TextField
              label="Last Name"
              gridArea={"last-name"}
              name="last-name"
            />
            <TextField
              label="Email"
              gridArea={"email"}
              width="100%"
              name="email"
            />
            <TextField
              label="PRN number"
              gridArea={"prn-no"}
              name="prn-number"
              value={prn}
              onChange={(e) => handlePrnInput(e)}
            />
            <TextField
              label="Roll number"
              gridArea={"roll-no"}
              name="roll-no"
              value={rollNo}
              onChange={(e) => handleRollNoInput(e)}
            />
            <MenuTrigger gridArea={"gender"}>
              <ActionButton>{gender || "Select Gender"}</ActionButton>
              <Menu onAction={(key) => setGender(key)}>
                <Item key="male">Male</Item>
                <Item key="female">Female</Item>
              </Menu>
            </MenuTrigger>
            <DatePicker
              label="Date of birth"
              gridArea={"dob"}
              maxValue={parseDate("2005-01-01")}
              value={dob}
              onChange={setDob}
            />
            <TextField
              label="Batch"
              gridArea={"batch"}
              name="batch"
              value={batch}
              onChange={(e) => handleBatchInput(e)}
            />
            <View gridArea={"buttons"}>
              <Button type="submit">Register</Button>
            </View>
          </Grid>
        </Form>
      </View>

      <Divider orientation="vertical" size="M" />

      <View
        padding="size-250"
        width="fit-content"
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
      >
        <Grid
          columns={["1fr", "1fr"]}
          rows={["size-500", "size-500"]}
          areas={["heading heading", "inputField inputField", "upload upload"]}
        >
          <View gridArea={"heading"} width="fit-content">
            <Heading level={4}>
              Upload an Excel sheet to add multiple Students at once.
            </Heading>
          </View>
          <View gridArea={"inputField"}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </View>
          {file && (
            <View gridArea={"upload"}>
              <Button onPress={handleMultipleStudentAddition}>Upload</Button>
            </View>
          )}
        </Grid>
      </View>
    </Flex>
  );
}

function AddNewUser() {
  return (
    <View>
      <View padding="size-200">
        <Flex gap={"size-125"}>
          <UserAdd />
          <Heading level={2}>Add user</Heading>
        </Flex>
      </View>
      <Divider size="M" />
      <Tabs aria-label="add new users">
        <TabList>
          <Item key={cons.USERS.TPO.type}>{cons.USERS.TPO.text}</Item>
          <Item key={cons.USERS.STUDENT.type}>{cons.USERS.STUDENT.text}</Item>
        </TabList>
        <TabPanels>
          <Item key={cons.USERS.TPO.type}>
            <View paddingX="size-100" paddingY="size-400">
              <AddTpo />
            </View>
          </Item>
          <Item key={cons.USERS.STUDENT.type}>
            <View paddingX="size-100" paddingY="size-400">
              <AddStudent />
            </View>
          </Item>
        </TabPanels>
      </Tabs>
    </View>
  );
}

export default AddNewUser;
