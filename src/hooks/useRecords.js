import { useState, useEffect } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function useRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const userRecordsRef = collection(db, cons.DB.COLLECTIONS.RECORDS);

    const unsubscribe = onSnapshot(userRecordsRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id };
      });
      if (data) setRecords(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return records;
}

export default useRecords;
