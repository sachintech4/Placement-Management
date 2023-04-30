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
} from "@adobe/react-spectrum";
import cons from "../cons";

function AddTpo() {
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const firstName = data.get("first-name");
    const lastName = data.get("last-name");
    const email = data.get("email");
    const id = data.get("id-number");

    console.log({
      firstName,
      lastName,
      email,
      id,
      gender,
      dob,
    });

    // send a post request to the server
  };

  return (
    <Flex direction="column" alignItems="start" gap={"size-200"}>
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
            <TextField label="ID" gridArea={"id-no"} name="id-number" />
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
              onChange={setDob}
            />
            <View gridArea={"buttons"}>
              <Button type="submit">Register</Button>
            </View>
          </Grid>
        </Form>
      </View>
    </Flex>
  );
}

function AddStudent() {
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const firstName = data.get("first-name");
    const lastName = data.get("last-name");
    const email = data.get("email");
    const prn = data.get("prn-number");
    const rollNo = data.get("roll-no");

    console.log({
      firstName,
      lastName,
      email,
      prn,
      rollNo,
      gender,
      dob,
    });
  };

  return (
    <Flex direction="column" alignItems="start" gap={"size-200"}>
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
            />
            <TextField
              label="Roll number"
              gridArea={"roll-no"}
              name="roll-no"
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
              onChange={setDob}
            />
            <View gridArea={"buttons"}>
              <Button type="submit">Register</Button>
            </View>
          </Grid>
        </Form>
      </View>
    </Flex>
  );
}

function AddNewUser() {
  return (
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
  );
}

export default AddNewUser;
