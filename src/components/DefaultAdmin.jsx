import React, { useContext } from "react";
import { View, Heading, Divider, Button } from "@adobe/react-spectrum";

import UserAdd from "@spectrum-icons/workflow/UserAdd";

function DefaultAdmin() {
  return (
    <View
      padding="size-250"
      width="fit-content"
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
    >
      <View paddingY="size-200">
        <Heading level={1}>Hello, Admin!</Heading>
      </View>
      <Divider size="M" />
      <View paddingY="size-200">
        <Heading level={3}>Welcome to the Placement Management System.</Heading>
        <Heading level={3}>
          Navigate through the options to add, delete or view users.
        </Heading>
        <Heading level={3}>
          Look for Profile and Settings to upadate your Email ID or Password.
        </Heading>
      </View>
    </View>
  );
}

export default DefaultAdmin;
