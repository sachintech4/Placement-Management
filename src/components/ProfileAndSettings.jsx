import React, { useCallback, useContext } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Item,
  View,
  Text,
  Flex,
} from "@adobe/react-spectrum";
import cons from "../cons";
import ChangePassword from "./ChangePassword";
import UpdateEmail from "./UpdateEmail";

function ProfileAndSettings({ role }) {
  const renderProfile = useCallback(() => {
    switch (role?.type) {
      case cons.USERS.ADMIN.type: {
        return <Text>Nothing to show</Text>;
      }
      default: {
        return (
          <View>
            <Text>Nothing to show.</Text>
          </View>
        );
      }
    }
  }, [role]);
  const renderSettings = useCallback(() => {
    switch (role?.type) {
      case cons.USERS.ADMIN.type: {
        return (
          <>
            <UpdateEmail />
            <ChangePassword />
          </>
        );
      }
      case cons.USERS.TPO.type: {
        return (
          <>
            <UpdateEmail />
            <ChangePassword />
          </>
        );
      }
      default: {
        return (
          <View>
            <Text>Nothing to show.</Text>
          </View>
        );
      }
    }
  }, [role]);
  return (
    <Tabs aria-label="Profile and Settings">
      <TabList>
        <Item key={"profile"}>Profile</Item>
        <Item key={"settings"}>Settings</Item>
      </TabList>
      <TabPanels>
        <Item key={"profile"}>
          <View paddingX="size-100" paddingY="size-400">
            {renderProfile()}
          </View>
        </Item>
        <Item key={"settings"}>
          <View paddingX="size-100" paddingY="size-400">
            <Flex direction={"column"} alignItems={"start"} gap="size-200">
              {renderSettings()}
            </Flex>
          </View>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

export default ProfileAndSettings;
