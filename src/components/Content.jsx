import React, { useCallback } from "react";
import { View } from "@adobe/react-spectrum";
import cons from "../cons";
import AddNewUser from "./AddNewUser";
import ProfileAndSettings from "./ProfileAndSettings";

function Content({ gridArea, role, selectedSidebarOption }) {
  const renderAdminContent = useCallback((sidebarOpt) => {
    switch (sidebarOpt?.type) {
      case cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type: {
        return <ProfileAndSettings role={role} />;
      }
      case cons.SIDEBARS.ADMIN.ADD_NEW_USER.type: {
        return <AddNewUser />;
      }
      default:
        return null;
    }
  }, []);

  const renderTpoContent = useCallback((sidebarOpt) => {
    switch (sidebarOpt?.type) {
      case cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type: {
        return <ProfileAndSettings role={role} />;
      }
      default:
        return null;
    }
  }, []);

  const renderStudentContent = useCallback((sidebarOpt) => {
    switch (sidebarOpt?.type) {
      case cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type: {
        return <ProfileAndSettings role={role} />;
      }
      default:
        return null;
    }
  }, []);

  const renderContent = useCallback(() => {
    switch (role?.type) {
      case cons.USERS.ADMIN.type: {
        return renderAdminContent(selectedSidebarOption);
      }
      case cons.USERS.TPO.type: {
        return renderTpoContent(selectedSidebarOption);
      }
      case cons.USERS.STUDENT.type: {
        return renderStudentContent(selectedSidebarOption);
      }
      default:
        return null;
    }
  }, [role, selectedSidebarOption]);

  return (
    <View
      gridArea={gridArea}
      height={"100%"}
      padding={"size-200"}
      backgroundColor={"gray-200"}
    >
      {renderContent()}
    </View>
  );
}

export default Content;
