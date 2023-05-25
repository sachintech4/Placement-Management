import { useState, useEffect } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function useCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const userCompaniesRef = collection(db, cons.DB.COLLECTIONS.COMPANIES);

    const unsubscribe = onSnapshot(userCompaniesRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id };
      });
      if (data) setCompanies(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return companies;
}

export default useCompanies;
