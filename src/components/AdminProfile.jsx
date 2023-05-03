import React from "react";
import { Flex } from "@adobe/react-spectrum";
import UpdateEmail from "./UpdateEmail";

function AdminProfile() {
  return (
    <Flex direction={"column"} alignItems={"start"}>
      <UpdateEmail />
    </Flex>
  );
}

export default AdminProfile;
