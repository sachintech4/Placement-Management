import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  SearchField,
  Flex,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Heading,
  Text,
  Grid,
  View,
} from "@adobe/react-spectrum";
import WebPages from "@spectrum-icons/workflow/WebPages";
import { AuthUserContext } from "../contexts";
import { db } from "../firebase-config";
import { doc, onSnapshot } from "@firebase/firestore";
import { useAsyncList } from "react-stately";
import usePlacements from "../hooks/usePlacements";
import { debounce } from "../utils";
import cons from "../cons";

function PlacementsAppliedTo() {
  const columns = useMemo(
    () => [
      { name: "Placement Drive Name", uid: "placementDriveName" },
      { name: "Email", uid: "email" },
      { name: "Students applied", uid: "studentsApplied" },
      { name: "Active Status", uid: "isActive" },
    ],
    []
  );

  const placements = usePlacements();
  const user = useContext(AuthUserContext);
  const [userPlacementData, setUserPlacementData] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(null);

  useEffect(() => {
    const getUserData = () => {
      try {
        const userDocRef = doc(db, cons.DB.COLLECTIONS.USERS_STUDENT, user.uid);

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          const documentData = snapshot.data();
          if (documentData)
            setUserPlacementData(documentData.placementsAppliedTo);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error getting user data:", error);
      }
    };
    getUserData();
  }, []);

  const placementsAppliedTo = placements.filter((placement) =>
    userPlacementData.includes(placement.uid)
  );

  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        placementsAppliedTo.forEach((placement) => {
          const shouldRowBeInList = Object.values(placement).some((cell) =>
            cell?.toString().toLowerCase().includes(filterText.toLowerCase())
          );
          if (shouldRowBeInList) filteredAndNormalisedItems.push(placement);
        });
        if (filteredAndNormalisedItems) return filteredAndNormalisedItems;
        return [];
      };

      let items = prepareRows();
      return { items };
    },
  });

  useEffect(() => {
    list.reload();
  }, [placements]);

  const handleRowAction = (key) => {
    const row = placementsAppliedTo.find((item) => item.uid === key);
    if (row) {
      setDetailsDialog(row);
    }
  };

  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });

  return (
    <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
      <View paddingX="size-200" paddingTop="size-200">
        <Flex gap={"size-125"}>
          <WebPages />
          <Heading level={2}>Placements Appiled To</Heading>
        </Flex>
      </View>
      <Divider size="M" />
      <SearchField
        label="Search"
        onSubmit={handleFilter}
        width="size-3600"
        onChange={handleSearchChange}
        onClear={() => list.setFilterText("")}
      />
      <TableView
        aria-label="Active placements"
        width={"98%"}
        maxHeight={"98%"}
        onAction={handleRowAction}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column key={column.uid} allowsResizing>
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={list.items}>
          {(item) => (
            <Row key={item.uid}>
              {(columnKey) => (
                <Cell>
                  {columnKey === "placementDriveName"
                    ? item["companyName"]
                    : columnKey === "isActive"
                    ? item[columnKey]
                      ? "Active"
                      : "Inactive"
                    : columnKey === "studentsApplied"
                    ? item["studentsApplied"].length
                    : item[columnKey]}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </TableView>
      <DialogContainer onDismiss={() => setDetailsDialog(null)}>
        {detailsDialog && (
          <Dialog isDismissable>
            <Heading>{`${detailsDialog.companyName}`}</Heading>
            <Divider />
            <Content>
              <Grid
                gap="size-200"
                areas={[
                  "email location",
                  "status status",
                  "companyDescription companyDescription",
                ]}
                columns={["1fr", "1fr"]}
              >
                <View gridArea="email">
                  <Heading level={4}>Email</Heading>
                  <Text>{detailsDialog.email}</Text>
                </View>
                <View gridArea="location">
                  <Heading level={4}>Location</Heading>
                  <Text>{detailsDialog.location}</Text>
                </View>
                <View gridArea="status">
                  <Heading level={4}>Status</Heading>
                  <Text>{detailsDialog.isActive ? "Active" : "Inactive"}</Text>
                </View>
                <View gridArea="companyDescription">
                  <Heading level={4}>Description</Heading>
                  <div
                    style={{ backgroundColor: "#e6e2d3" }}
                    dangerouslySetInnerHTML={{
                      __html: detailsDialog.companyDescription,
                    }}
                  ></div>
                </View>
              </Grid>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </Flex>
  );
}

export default PlacementsAppliedTo;
