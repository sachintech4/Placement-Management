import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function useTpos() {
  const [tpos, setTpos] = useState([]);

  useEffect(() => {
    const userTposRef = collection(db, cons.DB.COLLECTIONS.USERS_TPO);

    const unsubscribe = onSnapshot(userTposRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id };
      });
      if (data) setTpos(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return tpos;
}

export default useTpos;
