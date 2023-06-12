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
import { AuthUserContext } from "../contexts";
import { db } from "../firebase-config";
import { doc, onSnapshot } from "@firebase/firestore";
import usePlacements from "../hooks/usePlacements";
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

  console.log(placementsAppliedTo);

  return (
    <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
      <SearchField
        label="Search"
        // onSubmit={handleFilter}
        width="size-3600"
        // onChange={handleSearchChange}
        // onClear={() => list.setFilterText("")}
      />
      <TableView
        aria-label="Active placements"
        width={"98%"}
        maxHeight={"98%"}
        // sortDescriptor={list.sortDescriptor}
        // onAction={handleRowAction}
        // selectedKeys={selectedKeys}
        // onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column key={column.uid} allowsResizing>
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={placementsAppliedTo}>
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
                    : item[columnKey]}
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </TableView>
    </Flex>
  );
}

export default PlacementsAppliedTo;
