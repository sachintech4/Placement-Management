import React, { useCallback } from "react";
import { View } from "@adobe/react-spectrum";
import cons from "../cons";
import AddNewUser from "./AddNewUser";
import ProfileAndSettings from "./ProfileAndSettings";
import StudentList from "./StudentList";
import TpoList from "./TpoList";
import AddNewCompany from "./AddNewCompany";
import ShowCompanies from "./ShowCompanies";
import AddNewPlacementDrive from "./AddNewPlacementDrive";
import PlacementDriveDetalis from "./PlacementDriveDetails";
import PlacedStudents from "./PlacedStudents";
import ActivePlacements from "./ActivePlacements";
import PlacemnetsAppliedTo from "./PlacementsAppliedTo";

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
        return <StudentList role={role} />;
      }
      case cons.SIDEBARS.ADMIN.VIEW_TPO.type: {
        return <TpoList />;
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
      case cons.SIDEBARS.TPO.LIST_OF_STUDENTS.type: {
        return <StudentList role={role} />;
      }
      case cons.SIDEBARS.TPO.ADD_NEW_COMPANY.type: {
        return <AddNewCompany />;
      }
      case cons.SIDEBARS.TPO.SHOW_COMPANIES.type: {
        return <ShowCompanies />;
      }
      case cons.SIDEBARS.TPO.ADD_NEW_PLACEMENT_DRIVE.type: {
        return <AddNewPlacementDrive />;
      }
      case cons.SIDEBARS.TPO.PLACEMENT_DRIVE_DETAILS.type: {
        return <PlacementDriveDetalis />;
      }
      case cons.SIDEBARS.TPO.PLACED_STUDENTS.type: {
        return <PlacedStudents />;
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
      case cons.SIDEBARS.STUDENTS.ACTIVE_PLACEMENTS.type: {
        return <ActivePlacements />;
      }
      case cons.SIDEBARS.STUDENTS.PLACEMENTS_APPLIED_TO.type: {
        return <PlacemnetsAppliedTo />;
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
      overflow={"hidden auto"}
    >
      {renderContent()}
    </View>
  );
}

export default Content;
