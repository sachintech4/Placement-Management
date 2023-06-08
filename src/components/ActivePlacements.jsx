import React, { useMemo, useEffect, useState, useContext } from "react";
import usePlacements from "../hooks/usePlacements";
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
  Button,
} from "@adobe/react-spectrum";
import { useAsyncList } from "react-stately";
import { db } from "../firebase-config";
import { doc, getDoc, onSnapshot, updateDoc } from "@firebase/firestore";
import { debounce } from "../utils";
import { AuthUserContext } from "../contexts";
import cons from "../cons";

function ActivePlacements() {
  const placements = usePlacements();
  const activePlacements = placements.filter((placement) => placement.isActive);
  const user = useContext(AuthUserContext);

  const columns = useMemo(
    () => [
      { name: "Placement Drive Name", uid: "placementDriveName" },
      { name: "Email", uid: "email" },
      { name: "Students applied", uid: "studentsApplied" },
      { name: "Active Status", uid: "isActive" },
      { name: "Apply", uid: "apply" },
    ],
    []
  );

  const list = useAsyncList({
    async load({ filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        activePlacements.forEach((placement) => {
          const row = {
            id: placement.uid,
            placementDriveName: placement.companyName,
            email: placement.email,
            studentsApplied: placement.studentsApplied.length,
            isActive: placement.isActive ? "Active" : "Inactive",
          };
          const shouldRowBeInList = Object.values(row).some((cell) =>
            cell?.toString().toLowerCase().includes(filterText.toLowerCase())
          );
          if (shouldRowBeInList) filteredAndNormalisedItems.push(row);
        });
        if (filteredAndNormalisedItems) return filteredAndNormalisedItems;
        return [];
      };
      let items = prepareRows();
      console.log(items);
      return { items };
    },
  });

  const [detailsDialog, setDetailsDialog] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  useEffect(() => {
    list.reload();
  }, [placements]);

  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });
  const handleRowAction = (key) => {
    const row = list.items.find((item) => item.id === key);
    const placement = activePlacements.find(
      (placement) => placement.companyName === row.placementDriveName
    );
    if (placement) {
      setDetailsDialog(placement);
    }
  };

  const getUserDoc = async () => {
    try {
      const documentRef = doc(db, cons.DB.COLLECTIONS.USERS_STUDENT, user.uid);
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        // console.log("Document data:", documentData);
        return documentData;
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  return (
    <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
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
        sortDescriptor={list.sortDescriptor}
        onAction={handleRowAction}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column key={column.uid} allowsResizing>
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={list.items} loadingState={list.loadingState}>
          {(item) => (
            <Row>
              {(columnKey) => {
                if (columnKey === "apply") {
                  return (
                    <Cell>
                      <Button>Apply</Button>
                    </Cell>
                  );
                } else {
                  return <Cell>{item[columnKey]}</Cell>;
                }
              }}
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

export default ActivePlacements;
