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
} from "@adobe/react-spectrum";
import cons from "../cons";

function AddTpo() {
  const [gender, setGender] = useState(null);
  return (
    <Form>
      <TextField label="Enter First Name" />
      <TextField label="Enter Last Name" />
      <MenuTrigger>
        <ActionButton>{gender || "Select Gender"}</ActionButton>
        <Menu onAction={(key) => setGender(key)}>
          <Item key="male">Male</Item>
          <Item key="female">Female</Item>
        </Menu>
      </MenuTrigger>
      <TextField label="Enter Email" />
    </Form>
  );
}

function AddStudent() {
  const [gender, setGender] = useState(null);
  return (
    <Form>
      <TextField label="Enter First Name" />
      <TextField label="Enter Last Name" />
      <MenuTrigger>
        <ActionButton>{gender || "Select Gender"}</ActionButton>
        <Menu onAction={(key) => setGender(key)}>
          <Item key="male">Male</Item>
          <Item key="female">Female</Item>
        </Menu>
      </MenuTrigger>
      <TextField label="Enter Email" />
    </Form>
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
          <AddTpo />
        </Item>
        <Item key={cons.USERS.STUDENT.type}>
          <AddStudent />
        </Item>
      </TabPanels>
    </Tabs>
  );
}

export default AddNewUser;
