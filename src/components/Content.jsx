import React, { useCallback } from "react";
import { View } from "@adobe/react-spectrum";
import cons from "../cons";
import AddNewUser from "./AddNewUser";
import ProfileAndSettings from "./ProfileAndSettings";
import StudentList from "./StudentList";

function Content({ gridArea, role, selectedSidebarOption }) {
  const renderAdminContent = useCallback(() => {
    switch (selectedSidebarOption?.type) {
      case cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type: {
        return <ProfileAndSettings role={role} />;
      }
      case cons.SIDEBARS.ADMIN.ADD_NEW_USER.type: {
        return <AddNewUser />;
      }
      case cons.SIDEBARS.ADMIN.VIEW_STUDENTS.type: {
        return <StudentList />;
      }
      default:
        return null;
    }
  }, [role, selectedSidebarOption]);

  const renderTpoContent = useCallback(() => {
    switch (selectedSidebarOption?.type) {
      case cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type: {
        return <ProfileAndSettings role={role} />;
      }
      default:
        return null;
    }
  }, [role, selectedSidebarOption]);

  const renderStudentContent = useCallback(() => {
    switch (selectedSidebarOption?.type) {
      case cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type: {
        return <ProfileAndSettings role={role} />;
      }
      default:
        return null;
    }
  }, [role, selectedSidebarOption]);

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
      height={"100vh"}
      padding={"size-200"}
      backgroundColor={"gray-200"}
    >
      {renderContent()}
    </View>
  );
}

export default Content;
