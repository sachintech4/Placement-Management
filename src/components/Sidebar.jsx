import React, { useContext, useEffect, useState } from "react";
import {
  Flex,
  View,
  ActionButton,
  Text,
  Heading,
  ProgressCircle,
  ListBox,
  Item,
} from "@adobe/react-spectrum";
import cons from "../cons";
import { signOut } from "@firebase/auth";
import { AuthUserContext } from "../contexts";
import { db } from "../firebase-config";
import { doc, onSnapshot } from "@firebase/firestore";

// import icons for sidebars
import Settings from "@spectrum-icons/workflow/Settings";
import LogOut from "@spectrum-icons/workflow/LogOut";
import UserAdd from "@spectrum-icons/workflow/UserAdd";
import UserEdit from "@spectrum-icons/workflow/UserEdit";
import CollectionAdd from "@spectrum-icons/workflow/CollectionAdd";
import ViewDetail from "@spectrum-icons/workflow/ViewDetail";
import ExperienceAdd from "@spectrum-icons/workflow/ExperienceAdd";
import ViewList from "@spectrum-icons/workflow/ViewList";
import FolderUser from "@spectrum-icons/workflow/FolderUser";
import UserActivity from "@spectrum-icons/workflow/UserActivity";
import DataUser from "@spectrum-icons/workflow/DataUser";
import Artboard from "@spectrum-icons/workflow/Artboard";
import ViewStack from "@spectrum-icons/workflow/ViewStack";
import WebPages from "@spectrum-icons/workflow/WebPages";
import ExperienceAddTo from "@spectrum-icons/workflow/ExperienceAddTo";
import User from "@spectrum-icons/workflow/User";

const adminSidebarOptions = Object.values(cons.SIDEBARS.ADMIN);
const tpoSidebarOptions = Object.values(cons.SIDEBARS.TPO);
const studentSidebarOptions = Object.values(cons.SIDEBARS.STUDENTS);

function Sidebar({ gridArea, role, onOptionSelect }) {
  const authUser = useContext(AuthUserContext);

  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  let dbRef;
  if (role?.type === "tpo") {
    dbRef = cons.DB.COLLECTIONS.USERS_TPO;
  } else if (role?.type === "student") {
    dbRef = cons.DB.COLLECTIONS.USERS_STUDENT;
  }

  useEffect(() => {
    const getUserData = () => {
      if (role?.type === "tpo" || role?.type === "student") {
        try {
          const userDocRef = doc(db, dbRef, authUser.uid);

          const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            const documentData = snapshot.data();
            if (documentData) {
              setUserName(`${documentData.firstName} ${documentData.lastName}`);
            }
            setIsLoading(false);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error getting user data:", error);
        }
      }
    };
    getUserData();
  }, [role]);

  const logOut = async () => {
    await signOut(authUser.auth);
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "UserAdd":
        return <UserAdd />;
      case "UserEdit":
        return <UserEdit />;
      case "CollectionAdd":
        return <CollectionAdd />;
      case "ViewDetail":
        return <ViewDetail />;
      case "ExperienceAdd":
        return <ExperienceAdd />;
      case "ViewList":
        return <ViewList />;
      case "FolderUser":
        return <FolderUser />;
      case "UserActivity":
        return <UserActivity />;
      case "Artboard":
        return <Artboard />;
      case "ViewStack":
        return <ViewStack />;
      case "DataUser":
        return <DataUser />;
      case "WebPages":
        return <WebPages />;
      case "ExperienceAddTo":
        return <ExperienceAddTo />;
      default:
        return null;
    }
  };

  const renderSidebarOptions = () => {
    switch (role?.type) {
      case cons.USERS.ADMIN.type: {
        return adminSidebarOptions.map((opt, index) => {
          const IconComponent = renderIcon(opt.icon);
          return (
            <ActionButton
              key={`${index}${opt.text}`}
              onPress={() => {
                onOptionSelect(opt);
              }}
            >
              {IconComponent}
              <Text>{opt.text}</Text>
            </ActionButton>
          );
        });
      }
      case cons.USERS.TPO.type: {
        return tpoSidebarOptions.map((opt, index) => {
          const IconComponent = renderIcon(opt.icon);
          return (
            <ActionButton
              key={`${index}${opt.text}`}
              onPress={() => {
                onOptionSelect(opt);
              }}
            >
              {IconComponent}
              <Text>{opt.text}</Text>
            </ActionButton>
          );
        });
      }
      case cons.USERS.STUDENT.type: {
        return studentSidebarOptions.map((opt, index) => {
          const IconComponent = renderIcon(opt.icon);
          return (
            <ActionButton
              key={`${index}${opt.text}`}
              onPress={() => {
                onOptionSelect(opt);
              }}
            >
              {IconComponent}
              <Text>{opt.text}</Text>
            </ActionButton>
          );
        });
      }
      default: {
        return null;
      }
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
        <Heading level={"1"}>
          <User />
          {role?.type === "admin" ? (
            role.text
          ) : isLoading ? (
            <View width="100%" height="100%">
              <ProgressCircle
                aria-label="loading..."
                size={"S"}
                justifySelf={"center"}
                isIndeterminate
              />
            </View>
          ) : (
            <Text>{role?.type === "admin" ? role.text : userName}</Text>
          )}
        </Heading>

        <View height="100%" width="100%" overflow={"hidden auto"}>
          <Flex direction={"column"} gap={"size-100"} height="100%">
            {renderSidebarOptions()}
          </Flex>
        </View>
        <Flex direction={"column"} gap={"size-50"}>
          {/* <ListBox
            selectionMode="single"
            onSelectionChange={(selection) => {
              if (
                selection.currentKey ===
                cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type
              ) {
                onOptionSelect(cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS);
              }
            }}
            // items={cons.COMMON}
            aria-label="general options"
          >
            <Item
              key={cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.type}
              textValue="Profile and Settings"
            >
              <Settings />
              <Text>{cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.text}</Text>
            </Item>
            <Item key={cons.SIDEBARS.COMMON.LOGOUT.type}>
              <LogOut />
              <Text>{cons.SIDEBARS.COMMON.LOGOUT.text}</Text>
            </Item>
          </ListBox> */}
          <ActionButton
            onPress={() =>
              onOptionSelect(cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS)
            }
          >
            <Settings />
            <Text>{cons.SIDEBARS.COMMON.PROFILE_AND_SETTINGS.text}</Text>
          </ActionButton>
          <ActionButton onPress={logOut}>
            <LogOut />
            <Text>{cons.SIDEBARS.COMMON.LOGOUT.text}</Text>
          </ActionButton>
        </Flex>
      </Flex>
    </View>
  );
}

export default Sidebar;
