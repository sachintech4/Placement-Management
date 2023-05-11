import React, { useContext, useState, useEffect } from "react";
import { AuthUserContext } from "../contexts";
import { doc, getDoc, collection } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";
import { View } from "@adobe/react-spectrum";

function TpoProfile() {
  const user = useContext(AuthUserContext);
  const [tpo, setTpo] = useState({});

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [id, setId] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  useEffect(() => {
    const getTpoDoc = async () => {
      const docRef = doc(db, cons.DB.COLLECTIONS.USERS_TPO, user.uid);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTpo(docSnap.data());
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTpoDoc();
  }, []);

  return <View>Tpo Profile</View>;
}

export default TpoProfile;
