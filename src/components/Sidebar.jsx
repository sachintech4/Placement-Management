import React from "react";
import { Flex, View, ActionButton, Text, Grid } from "@adobe/react-spectrum";
import Settings from "@spectrum-icons/workflow/Settings";
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
    <Grid
      gridArea={gridArea}
      areas={["options", "settings"]}
      rows={["auto", "size-800"]}
      gap={"size-200"}
    >
      <Flex gridArea="options" direction={"column"}>
        {renderSidebarOptions()}
      </Flex>
      <Flex gridArea={"settings"} justifyContent={"center"}>
        <ActionButton>
          <Settings />
          <Text>Settings</Text>
        </ActionButton>
      </Flex>
    </Grid>
  );
}

export default Sidebar;
