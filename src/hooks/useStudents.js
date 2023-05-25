import { useState, useEffect } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function useStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const userStudentsRef = collection(db, cons.DB.COLLECTIONS.USERS_STUDENT);

    const unsubscribe = onSnapshot(userStudentsRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id };
      });
      if (data) setStudents(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return students;
}

export default useStudents;
