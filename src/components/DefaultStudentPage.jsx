import React, { useContext, useEffect, useState } from "react";
import { View, Heading, Divider } from "@adobe/react-spectrum";
import { db } from "../firebase-config";
import { doc, onSnapshot } from "@firebase/firestore";
import { AuthUserContext } from "../contexts";
import cons from "../cons";

function DefaultStudentPage() {
  const user = useContext(AuthUserContext);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const getUserData = () => {
      try {
        const userDocRef = doc(db, cons.DB.COLLECTIONS.USERS_STUDENT, user.uid);

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          const documentData = snapshot.data();
          if (documentData) {
            setUserName(`${documentData.firstName} ${documentData.lastName}`);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    };
    getUserData();
  }, []);

  return (
    <View
      padding="size-250"
      width="fit-content"
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
    >
      <View paddingY="size-200">
        <Heading level={1}>Hello, {userName}!</Heading>
      </View>
      <Divider size="M" />
      <View paddingY="size-200">
        <Heading level={3}>Welcome to the Placement Management System.</Heading>
        <Heading level={3}>
          Naviagte through the sidebar options according to your need.
        </Heading>
        <Heading level={3}>
          To get your placement status approved look for "Placement Status" and
          upload your offer letter.
        </Heading>
        <Heading level={3}>
          Look for Profile and Settings to upadate your Email ID or Password.
        </Heading>
      </View>
    </View>
  );
}

export default DefaultStudentPage;
