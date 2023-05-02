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
import { ToastQueue } from "@react-spectrum/toast";
import cons from "../cons";

function AddTpo() {
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const details = {
      firstName: data.get("first-name"),
      lastName: data.get("last-name"),
      email: data.get("email"),
      id: data.get("id-number"),
      gender: gender,
      dob: dob,
      role: "tpo",
    };

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
        ToastQueue.positive("New user: TPO added", {
          timeout: 1000,
        });
      } else {
        throw { code: resJson.code, message: resJson.message };
      } 
    } catch (error) {
      console.error(error);

      if (error.code === "email-already-exists") {
        ToastQueue.negative(error.message, { timeout: 1000 });
      } else {
        ToastQueue.negative("error creating a new TPO user", {
          timeout: 1000,
        });
      }
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    const details = {
      firstName: data.get("first-name"),
      lastName: data.get("last-name"),
      email: data.get("email"),
      prn: data.get("prn-number"),
      rollNo: data.get("roll-no"),
      gender: gender,
      dob: dob,
      role: "student",
    };

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

      if (!res.ok) {
        throw new Error(`${res.status}, ${res.msg}`);
      } else {
        ToastQueue.positive("New user: Student added", {
          timeout: 1000,
        });
      }
    } catch (error) {
      ToastQueue.negative("Error adding new user: Student", {
        timeout: 1000,
      });
      console.error("error creating a new Student user");
      console.error(error);
    }
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
