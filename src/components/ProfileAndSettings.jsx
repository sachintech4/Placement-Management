import React, { useCallback } from "react";
import { Tabs, TabList, TabPanels, Item, View, Text } from "@adobe/react-spectrum";
import cons from "../cons";

function ProfileAndSettings({ role }) {

  const renderProfile = useCallback(() => {
    switch (role?.type) {
      case cons.USERS.ADMIN.type: {
        return (
          <View>
            <Text>Nothing to show.</Text>
          </View>
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
  const renderSettings = useCallback(() =>  {
    switch (role?.type) {
      case cons.USERS.ADMIN.type: {
        return (
          <View>
            <Text>admin settings</Text>
          </View>
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
          {renderSettings()}
        </View>
      </Item>
    </TabPanels>
  </Tabs>
  );
}

export default ProfileAndSettings;
