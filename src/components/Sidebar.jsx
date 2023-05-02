import React from "react";
import { Flex, View, ActionButton, Text, Grid } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
import LogOut from "@spectrum-icons/workflow/LogOut";
import cons from "../cons";

const adminSidebarOptions = Object.values(cons.SIDEBARS.ADMIN);

function Sidebar({ gridArea, role, onOptionSelect }) {
  const renderSidebarOptions = () => {
    switch(role?.type) {
      case cons.USERS.ADMIN.type: {
        return adminSidebarOptions.map(
          (opt, index) => (
            <ActionButton
              key={`${index}${opt.text}`}
              onPress={() => { onOptionSelect(opt) }}
            >
              {opt.text}
            </ActionButton>
          )
        );
      }
      default: onOptionSelect(null);
    }
  };

  return (
    <View backgroundColor={"blue-400"} padding={"size-100"} height={"100vh"}>
      <Flex
        gridArea={gridArea}
        direction={"column"}
        height={"100%"}
        gap={"size-100"}
      >
        <View height="100%" width="100%" overflow={"hidden auto"}>
          <Flex direction={"column"} gap={"size-25"} height="100%">
            {renderSidebarOptions()}
          </Flex>
        </View>
        <Flex gridArea={"bottom"} direction={"column"}>
          <ActionButton>
            <LogOut />
            <Text>Log out</Text>
          </ActionButton>
          <ActionButton>
            <Settings />
            <Text>Settings</Text>
          </ActionButton>
        </Flex>
      </Flex>
    </View>
  );
}

export default Sidebar;
