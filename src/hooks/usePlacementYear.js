import { useState, useEffect } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function useBatch(placementYear) {
  const [placementByYear, setPlacementByYear] = useState([]);

  useEffect(() => {
    const userPlacementYearRef = collection(
      db,
      `${cons.DB.COLLECTIONS.PLACEMENT_RECORDS}/${placementYear}/placements`
    );

    const unsubscribe = onSnapshot(userPlacementYearRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id };
      });
      if (data) setPlacementByYear(data);
    });

    return () => {
      unsubscribe();
    };
  }, [placementYear]);

  return placementByYear;
}

export default useBatch;
