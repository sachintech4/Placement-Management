import React, { useCallback } from "react";
import { View } from "@adobe/react-spectrum";
import cons from "../cons";
import AddNewUser from "./AddNewUser";

function Content({ gridArea, role, selectedSidebarOption }) {  
  const renderContent = useCallback(() => {
    switch(selectedSidebarOption?.type) {
      case cons.SIDEBARS.ADMIN.ADD_NEW_USER.type: {
        return <AddNewUser />;
      }
      default: return null;
    }
  }, [role, selectedSidebarOption]);
  return (
    <View
      gridArea={gridArea}
      height={"100%"}
      padding={"size-200"}
    >
      {renderContent()}
    </View>
  )
}

export default Content;
