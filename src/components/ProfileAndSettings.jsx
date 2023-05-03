import React, { useCallback, useContext } from "react";
import { Tabs, TabList, TabPanels, Item, View, Text, Button } from "@adobe/react-spectrum";
import cons from "../cons";
import { sendPasswordResetEmail } from "@firebase/auth";
import { AuthUserContext } from "../contexts";
import { ToastQueue } from "@react-spectrum/toast";

function AdminSettings() {
  const authUser = useContext(AuthUserContext);
  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(authUser.auth, authUser.email);
      ToastQueue.positive("Password reset email send to your email id", { timeout: 1000 });
    } catch (error) {
      console.error('error sending password reset email');
      console.error(error);
      ToastQueue.negative("Failed to send password reset email, please try after some time", { timeout: 1000 });
    }
  };
  return(
    <View>
      <Button onPress={handleReset}>Reset password</Button>
    </View>
  );
}

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
        return <AdminSettings />;
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
