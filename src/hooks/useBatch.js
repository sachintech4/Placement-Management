import { useState, useEffect } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function useBatch(batchYear) {
  const [batch, setBatch] = useState([]);

  useEffect(() => {
    const userBatchRef = collection(
      db,
      `${cons.DB.COLLECTIONS.RECORDS}/${batchYear}/students`
    );

    const unsubscribe = onSnapshot(userBatchRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id };
      });
      if (data) setBatch(data);
    });

    return () => {
      unsubscribe();
    };
  }, [batchYear]);

  return batch;
}

export default useBatch;
