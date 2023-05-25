import { useState, useEffect } from "react";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase-config";
import cons from "../cons";

function usePlacements() {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const placementsRef = collection(db, cons.DB.COLLECTIONS.PLACEMENTS);

    const unsubscribe = onSnapshot(placementsRef, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id };
      });
      if (data) setPlacements(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return placements;
}

export default usePlacements;
