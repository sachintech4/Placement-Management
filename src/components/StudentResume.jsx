import React, { useContext, useState } from "react";
import { Flex, Text, View } from "@adobe/react-spectrum";
import { storage } from "../firebase-config";
import { ref, uploadBytes } from "firebase/storage";
import { AuthUserContext } from "../contexts";

function StudentResume() {
  const [file, setFile] = useState(null);

  const user = useContext(AuthUserContext);
  const resumeRef = ref(storage, `/resumes/${user.uid}`);
  console.log(resumeRef);

  const handleResumeUpload = () => {
    try {
      uploadBytes(resumeRef, file).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  return (
    <Flex direction="column" alignItems="start" gap={"size-200"}>
      <View>
        <Text>Upload or Download your resume.</Text>
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
        <button onClick={handleResumeUpload}>Upload</button>
      </View>
    </Flex>
  );
}

export default StudentResume;
