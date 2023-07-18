import React, { useEffect, useState, useMemo } from "react";
import {
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  SearchField,
  Flex,
  useCollator,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Heading,
  Text,
  Grid,
  View,
  Item,
  Button,
  Picker,
} from "@adobe/react-spectrum";
import ViewStack from "@spectrum-icons/workflow/ViewStack";
import { ToastQueue } from "@react-spectrum/toast";
import { useAsyncList } from "react-stately";
import Download from "@spectrum-icons/workflow/Download";
import cons from "../cons";
import { debounce } from "../utils";
import usePlacementRecords from "../hooks/usePlacementRecords";
import usePlacementYear from "../hooks/usePlacementYear";

import { collection } from "@firebase/firestore";
import { db } from "../firebase-config";
import { doc, getDocs, onSnapshot, writeBatch } from "@firebase/firestore";

function PlacementRecords() {
  const columns = useMemo(() => [
    { name: "Placement Drive Name", uid: "placementDriveName" },
    { name: "Email", uid: "email" },
    { name: "Students applied", uid: "studentsApplied" },
    { name: "Year Active", uid: "year" },
  ]);

  const [placementYear, setPlacementYear] = useState(null);
  const placementRecords = usePlacementRecords();
  const placementYears = placementRecords.map((item) => item.uid);
  const placementByYear = usePlacementYear(placementYear);

  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        placementByYear.forEach((placement) => {
          const createdAtTimestamp = placement.createdAt;
          const createdAtDate = createdAtTimestamp.toDate();
          const year = createdAtDate.getFullYear().toString();
          const row = {
            id: placement.uid,
            placementDriveName: placement.companyName,
            email: placement.email,
            studentsApplied: placement.studentsApplied.length,
            year: year,
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
      return { items };
    },
  });
  useEffect(() => {
    list.reload();
  }, [placementByYear]);

  const [detailsDialog, setDetailsDialog] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const handleRowAction = (key) => {
    const row = list.items.find((item) => item.id === key);
    const placement = placementByYear.find(
      (placement) => placement.companyName === row.placementDriveName
    );
    if (placement) {
      const createdAtTimestamp = placement.createdAt;
      const createdAtDate = createdAtTimestamp.toDate();
      const year = createdAtDate.getFullYear().toString();
      setDetailsDialog(placement);
      setPlacementYear(year);
    }
  };
  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });
  const downloadExcelSheet = async (studentsApplied, placementDriveName) => {
    try {
      const queryParams = new URLSearchParams({
        students: studentsApplied.join(","),
        placementDriveName: placementDriveName,
        batch: placementYear,
      });
      const res = await fetch(
        `${cons.BASE_SERVER_URL}/downloadExcelSheetFromRecords?${queryParams}`
      );
      console.log(res.url);
      if (res.ok) {
        const link = document.createElement("a");
        link.href = res.url;
        link.donwload = `${placementDriveName}.xlsx`;

        link.click();

        ToastQueue.positive(
          `Excel sheet for ${placementDriveName} downloaded`,
          {
            timeout: 1000,
          }
        );
      } else {
        throw new Error("Error downloading excel sheet");
      }
    } catch (error) {
      console.error(error);

      ToastQueue.negative("Error downloading excel sheet", {
        timeout: 1000,
      });
    }
  };

  return (
    <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
      <View paddingX="size-200" paddingTop="size-200">
        <Flex gap={"size-125"}>
          <ViewStack />
          <Heading level={2}>Placement Records</Heading>
        </Flex>
      </View>
      <Divider size="M" />
      <Picker
        label="Select Year"
        items={placementYears}
        onSelectionChange={setPlacementYear}
      >
        {placementYears.map((item) => (
          <Item key={item}>{item}</Item>
        ))}
      </Picker>
      <View>
        <Divider size="M" />
      </View>
      <SearchField
        label="Search"
        onSubmit={handleFilter}
        width="size-3600"
        onChange={handleSearchChange}
        onClear={() => list.setFilterText("")}
      />
      <TableView
        aria-label="Placements"
        width={"98%"}
        maxHeight={"98%"}
        sortDescriptor={list.sortDescriptor}
        onAction={handleRowAction}
        // selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              key={column.uid}
              allowsResizing
              // allowsSorting={column.uid === "rollNo"}
            >
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={list.items} loadingState={list.loadingState}>
          {(item) => (
            <Row>
              {(columnKey) => {
                if (columnKey === "isActive") {
                  return (
                    <Cell>
                      <Switch
                        aria-label="Active Status"
                        isSelected={item.isActive}
                        onChange={() => handleSwitch(item)}
                      ></Switch>
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
                  "status year",
                  "downloadExcelSheet downloadExcelSheet",
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
                <View gridArea="year">
                  <Heading level={4}>Year</Heading>
                  <Text>{placementYear}</Text>
                </View>
                <View gridArea="downloadExcelSheet">
                  <Button
                    onPress={() =>
                      downloadExcelSheet(
                        detailsDialog.studentsApplied,
                        detailsDialog.companyName
                      )
                    }
                  >
                    <Download />
                    <Text>Student Details</Text>
                  </Button>
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

export default PlacementRecords;
