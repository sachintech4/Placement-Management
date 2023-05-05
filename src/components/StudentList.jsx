import React, { useEffect } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "@firebase/firestore";
import cons from "../cons";

function StudentList() {
  useEffect(() => {
    const userStudentsRef = collection(db, cons.DB.COLLECTIONS.USERS_STUDENT);

    const unsubscribe = onSnapshot(userStudentsRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      console.log("User students data:", data);
    });

    () => {
      unsubscribe();
    };
  }, []);

  return <div>student list</div>;
}

export default StudentList;
