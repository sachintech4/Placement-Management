import React, { useState } from "react";
import { View, Form, TextField, ActionButton } from "@adobe/react-spectrum";
import Visibility from "@spectrum-icons/workflow/Visibility";
import VisibilityOff from "@spectrum-icons/workflow/VisibilityOff";

function PasswordInputField({ label }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      label={label}
      type={isVisible ? "text" : "password"}
      icon={
        <ActionButton
          isQuiet
          onPress={() => {
            setIsVisible(!isVisible);
          }}
        >
          {isVisible ? <Visibility /> : <VisibilityOff />}
        </ActionButton>
      }
      isRequired
    />
  );
}

function ResetPassword() {
  return (
    <View>
      <Form>
        <PasswordInputField label="Current password" />
        <PasswordInputField label="New password" />
        <PasswordInputField label="Re-type new password" />
      </Form>
    </View>
  );
}

export default ResetPassword;
