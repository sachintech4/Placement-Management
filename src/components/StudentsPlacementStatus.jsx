import React, { useContext, useState, useEffect } from "react";
import {
  Flex,
  Text,
  View,
  Button,
  Grid,
  Heading,
  Divider,
  Picker,
  Item,
  TextField,
  Header,
  Content,
} from "@adobe/react-spectrum";
import Artboard from "@spectrum-icons/workflow/Artboard";
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
import { useAsyncList } from "react-stately";
import { storage, db } from "../firebase-config";
import { AuthUserContext } from "../contexts";
import cons from "../cons";
import useCompanies from "../hooks/useCompanies";

function StudentPlacementStatus() {
  const [file, setFile] = useState(null);
  const user = useContext(AuthUserContext);
  const offerLetterRef = ref(storage, `/offerLetters/${user.uid}`);
  const studentDocRef = doc(db, cons.DB.COLLECTIONS.USERS_STUDENT, user.uid);
  const [isOfferLetterAvailable, setIsOfferLetterAvailable] = useState(null);
  const [offerLetterDownloadLink, setOfferLetterDownloadLink] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [salaryPackage, setSalaryPackage] = useState(null);
  const [revokeOfferLetterStatus, setRevokeOfferLetterStatus] = useState(null);
  const [isPlaced, setIsPlaced] = useState(null);
  const [isPlacedAt, setIsPlacedAt] = useState(null);

  const companies = useCompanies();

  const list = useAsyncList({
    async load() {
      const prepareRows = () => {
        const rows = companies.map((cr) => ({
          id: cr.uid,
          companyName: cr.companyName,
          email: cr.email,
          location: cr.location,
        }));
        return rows;
      };
      let items = prepareRows();
      return { items };
    },
  });

  useEffect(() => {
    list.reload();
  }, [companies]);

  useEffect(() => {
    const unsubcsribe = onSnapshot(studentDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.revokeOfferLetter) {
          setRevokeOfferLetterStatus(true);
        } else {
          setRevokeOfferLetterStatus(false);
        }
        if (data.offerLetter) {
          setIsOfferLetterAvailable(true);
          setOfferLetterDownloadLink(data.offerLetter);
        } else {
          setIsOfferLetterAvailable(false);
        }
        if (data.isPlaced) {
          setIsPlaced(data.isPlaced);
        }
        if (data.isPlacedAt) {
          setIsPlacedAt(data.isPlacedAt);
        }
      } else {
        console.log("data does not exist");
      }
    });
  }, []);

  const handleCompanyChange = (value) => {
    const selectedCompany = companies.find((company) => company.uid === value);
    setSelectedCompany(selectedCompany);
  };

  const handleOfferLetterUpload = async () => {
    try {
      if (!selectedCompany) {
        ToastQueue.negative("Please select a company", { timeout: 1000 });
        return;
      }
      if (!salaryPackage) {
        ToastQueue.negative("Please enter CTC", { timeout: 1000 });
        return;
      }

      await uploadBytes(offerLetterRef, file);
      const downloadRef = await getDownloadURL(offerLetterRef);
      updateStudentsOfferLetterFieldAndSalary(downloadRef);

      await updateDoc(studentDocRef, {
        revokeOfferLetter: null,
      });

      ToastQueue.positive("OfferLetter uploaded Successfully", {
        timeout: 1000,
      });
    } catch (error) {
      ToastQueue.negative("Offer Letter could not be uploaded.", {
        timeout: 1000,
      });
    }
  };

  const updateStudentsOfferLetterFieldAndSalary = async (downloadRef) => {
    try {
      const trimmedSalaryPackage = salaryPackage ? salaryPackage.trim() : "";
      await updateDoc(studentDocRef, {
        offerLetter: downloadRef,
        tempSalaryPackage: trimmedSalaryPackage,
        tempCompany: {
          companyUid: selectedCompany.uid,
          companyName: selectedCompany.companyName,
        },
      });
    } catch (error) {
      console.error("Cannot update students Offer Letter field", error);
    }
  };

  const handelOfferLetterDeletion = async () => {
    try {
      await deleteObject(offerLetterRef);
      await updateDoc(studentDocRef, { offerLetter: null });
      ToastQueue.positive("offer Letter deleted successfully", {
        timeout: 1000,
      });
    } catch (error) {
      ToastQueue.negative("Could not delete Offer Letter", { timeout: 1000 });
    }
  };

  return (
    <View paddingLeft={"size-200"} paddingRight={"size-200"}>
      <View paddingX="size-200" paddingTop="size-200">
        <Flex gap={"size-125"}>
          <Artboard />
          <Heading level={2}>Placement Status</Heading>
        </Flex>
      </View>
      <View paddingTop={"size-200"} paddingBottom={"size-200"}>
        <Divider size="M" />
      </View>
      <Flex direction="column" alignItems="start" gap={"size-200"}>
        <Heading level={"4"}>
          Your current placement status:
          {isPlaced ? " Placed" : " Not Placed"}
        </Heading>
        {isPlaced ? (
          <View>
            <Content>
              Congratulations! You have been placed at {isPlacedAt.companyName}.
            </Content>
          </View>
        ) : null}
        {revokeOfferLetterStatus ? (
          <View>
            <Header>
              Your application for approving placemnet status has been revoked.
              Please reupload your Offer Letter.
            </Header>
          </View>
        ) : null}
        {isOfferLetterAvailable ? (
          <View>
            <Grid areas={["delete", "view"]} gap={"size-100"}>
              <Button
                gridArea={"delete"}
                variant="primary"
                onPress={handelOfferLetterDeletion}
              >
                <Delete />
                <Text>Delete existing Offer Letter.</Text>
              </Button>
              <Button
                gridArea={"view"}
                variant="primary"
                onPress={() => window.open(offerLetterDownloadLink)}
              >
                <ViewDetail />
                <Text>View Offer Letter</Text>
              </Button>
            </Grid>
          </View>
        ) : (
          <View>
            {list.isLoading ? (
              <p>Loading companies...</p>
            ) : list.items.length === 0 ? (
              <p>No companies available</p>
            ) : (
              <Picker
                label="Select a company"
                items={list.items}
                onSelectionChange={handleCompanyChange}
                width="size-2400"
              >
                {(item) => <Item>{item.companyName}</Item>}
              </Picker>
            )}

            <View>
              <TextField
                label="Enter CTC eg. if 8LPA then 8,00,000"
                onChange={setSalaryPackage}
              />
            </View>

            <View>
              <View>
                <Text>Upload your Offer Letter.</Text>
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
                <button onClick={handleOfferLetterUpload}>Upload</button>
              </View>
            </View>
          </View>
        )}
      </Flex>
    </View>
  );
}

export default StudentPlacementStatus;
