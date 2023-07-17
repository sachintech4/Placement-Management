import React, { useContext, useState, useEffect } from "react";
import { Flex, Text, View, Button, Grid } from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { doc, updateDoc, onSnapshot } from "@firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Delete from "@spectrum-icons/workflow/Delete";
import ViewDetail from "@spectrum-icons/workflow/ViewDetail";
import { storage, db } from "../firebase-config";
import { AuthUserContext } from "../contexts";
import cons from "../cons";

function StudentResume() {
  const [file, setFile] = useState(null);

  const user = useContext(AuthUserContext);
  const resumeRef = ref(storage, `/resumes/${user.uid}`);
  const studentDocRef = doc(db, cons.DB.COLLECTIONS.USERS_STUDENT, user.uid);
  const [isResumeAvailable, setIsResumeAvailable] = useState(null);
  const [resumeDownloadLink, setResumeDownloadLink] = useState(null);

  useEffect(() => {
    const unsubcsribe = onSnapshot(studentDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.resume) {
          setIsResumeAvailable(true);
          setResumeDownloadLink(data.resume);
        } else {
          setIsResumeAvailable(false);
        }
      } else {
        console.log("data does not exist");
      }
    });
  }, []);

  const handleResumeUpload = async () => {
    try {
      await uploadBytes(resumeRef, file);
      const downloadRef = await getDownloadURL(resumeRef);
      updateStudentsResumeField(downloadRef);
      ToastQueue.positive("Resume uploaded Successfully", { timeout: 1000 });
    } catch (error) {
      ToastQueue.negative("Resume could not be uploaded.", { timeout: 1000 });
    }
  };

  const updateStudentsResumeField = async (downloadRef) => {
    try {
      await updateDoc(studentDocRef, { resume: downloadRef });
    } catch (error) {
      console.error("Cannot update students resume field");
    }
  };

  const handelResumeDeletion = async () => {
    try {
      await deleteObject(resumeRef);
      await updateDoc(studentDocRef, { resume: null });
      ToastQueue.positive("Resume deleted successfully", { timeout: 1000 });
    } catch (error) {
      ToastQueue.negative("Could not delete Resume", { timeout: 1000 });
    }
  };

  return (
    <Flex direction="column" alignItems="start" gap={"size-200"}>
      {isResumeAvailable ? (
        <View>
          <Grid areas={["delete", "view"]} gap={"size-100"}>
            <Button
              gridArea={"delete"}
              variant="primary"
              onPress={handelResumeDeletion}
            >
              <Delete />
              <Text>Delete existing Resume.</Text>
            </Button>
            <Button
              gridArea={"view"}
              variant="primary"
              onPress={() => window.open(resumeDownloadLink)}
            >
              <ViewDetail />
              <Text>View Resume</Text>
            </Button>
          </Grid>
        </View>
      ) : (
        <View>
          <Flex direction="column" gap="size-200">
            <View>
              <Text>Upload your resume.</Text>
            </View>
            <View
              padding="size-250"
              width="fit-content"
              borderWidth="thin"
              borderColor="dark"
              borderRadius="medium"
            >
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              {/* <button onClick={handleResumeUpload}>Upload</button> */}
            </View>
            {file && (
              <View>
                <Button onPress={handleResumeUpload}>Upload Resume.</Button>
              </View>
            )}
          </Flex>
        </View>
      )}
    </Flex>
  );
}

export default StudentResume;
