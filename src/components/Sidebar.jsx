import React, { useContext } from "react";
import { Flex, View, ActionButton, Text, Heading } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import LogOut from "@spectrum-icons/workflow/LogOut";
import cons from "../cons";
import { signOut } from "@firebase/auth";
import { AuthUserContext } from "../contexts";

const adminSidebarOptions = Object.values(cons.SIDEBARS.ADMIN);
const tpoSidebarOptions = Object.values(cons.SIDEBARS.TPO);

function Sidebar({ gridArea, role, onOptionSelect }) {
  const authUser = useContext(AuthUserContext);

  const logOut = async () => {
    await signOut(authUser.auth);
  };

  const renderSidebarOptions = () => {
    switch (role?.type) {
      case cons.USERS.ADMIN.type: {
        return adminSidebarOptions.map((opt, index) => (
          <ActionButton
            key={`${index}${opt.text}`}
            onPress={() => {
              onOptionSelect(opt);
            }}
          >
            {opt.text}
          </ActionButton>
        ));
      }
      case cons.USERS.TPO.type: {
        return tpoSidebarOptions.map((opt, index) => (
          <ActionButton
            key={`${index}${opt.text}`}
            onPress={() => {
              onOptionSelect(opt);
            }}
          >
            {opt.text}
          </ActionButton>
        ));
      }
      default:
        onOptionSelect(null);
    }
  };

  return (
    <View padding={"size-100"} height={"100vh"}>
      <Flex
        gridArea={gridArea}
        direction={"column"}
        height={"100%"}
        gap={"size-100"}
      >
        <Heading level={"1"}>{role?.text}</Heading>
        <View height="100%" width="100%" overflow={"hidden auto"}>
          <Flex direction={"column"} gap={"size-100"} height="100%">
            {renderSidebarOptions()}
          </Flex>
        </View>
        <Flex direction={"column"} gap={"size-50"}>
          <ActionButton onPress={logOut}>
            <LogOut />
            <Text>{cons.SIDEBARS.COMMON.LOGOUT.text}</Text>
          </ActionButton>
          <ActionButton
            onPress={() =>
              onOptionSelect(cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS)
            }
          >
            <Settings />
            <Text>{cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.text}</Text>
          </ActionButton>
        </Flex>
      </Flex>
    </View>
  );
}

export default Sidebar;
