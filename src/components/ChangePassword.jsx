import React, { useCallback, useContext } from "react";
import { View, Button } from "@adobe/react-spectrum";
import { sendPasswordResetEmail } from "@firebase/auth";
import { AuthUserContext } from "../contexts";
import { ToastQueue } from "@react-spectrum/toast";

function ChangePassword() {
  const authUser = useContext(AuthUserContext);
  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(authUser.auth, authUser.email);
      ToastQueue.positive("Password reset email sent to your email id", {
        timeout: 1000,
      });
    } catch (error) {
      console.error("error sending password reset email");
      console.error(error);
      ToastQueue.negative(
        "Failed to send password reset email, please try after some time",
        { timeout: 1000 }
      );
    }
  };
  return (
    <View>
      <Button onPress={handleReset}>Reset password</Button>
    </View>
  );
}

export default ChangePassword;
