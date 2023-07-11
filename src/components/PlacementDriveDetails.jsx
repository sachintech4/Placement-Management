import React, { useMemo, useState, useEffect, useContext } from "react";
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
  Item,
  Switch,
  Button,
} from "@adobe/react-spectrum";
import { ActionBar, ActionBarContainer } from "@react-spectrum/actionbar";
import { ToastQueue } from "@react-spectrum/toast";
import { db } from "../firebase-config";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";
import Delete from "@spectrum-icons/workflow/Delete";
import Download from "@spectrum-icons/workflow/Download";
import usePlacements from "../hooks/usePlacements";
import { useAsyncList } from "react-stately";
import { debounce } from "../utils";
import { AuthUserContext } from "../contexts";
import cons from "../cons";

function PlacementDriveDetalis() {
  const placements = usePlacements();

  const columns = useMemo(() => [
    { name: "Placement Drive Name", uid: "placementDriveName" },
    { name: "Email", uid: "email" },
    { name: "Students applied", uid: "studentsApplied" },
    { name: "Active Status", uid: "isActive" },
  ]);

  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        placements.forEach((placement) => {
          const row = {
            id: placement.uid,
            placementDriveName: placement.companyName,
            email: placement.email,
            studentsApplied: placement.studentsApplied.length,
            isActive: placement.isActive,
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
  }, [placements]);

  const [detailsDialog, setDetailsDialog] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [placementYear, setPlacementYear] = useState(null);
  const user = useContext(AuthUserContext);

  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });
  const handleRowAction = (key) => {
    const row = list.items.find((item) => item.id === key);
    const placement = placements.find(
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

  const handleActionbarAction = async (actionKey) => {
    if (actionKey === "delete") {
      setDeleteConfirmation(true);
    }
  };

  const handlePermanentDeletion = async () => {
    // set slectedRowIds value to each placements uid if selectedKeys equals "all" else set it with the selected keys
    const selectedRowIds =
      selectedKeys === "all"
        ? placements.map((placement) => placement.uid)
        : Array.from(selectedKeys);
    // now send these id through a function call to backend to delete them
    const data = {
      rows: selectedRowIds,
      token: user.accessToken,
    };

    try {
      const res = await fetch(
        `${cons.BASE_SERVER_URL}/permanentlyDeletePlacements`,
        {
          method: "delete",
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const resJson = await res.json();
      // show a toast msg
      if (resJson.code === "success") {
        ToastQueue.positive(resJson.message, {
          timeout: 1000,
        });
      } else {
        ToastQueue.negative(resJson.message, {
          timeout: 1000,
        });
      }
    } catch (error) {
      console.error("failed to delete placements");
      console.error(error);
      // show a toast msg
      ToastQueue.negative("Failed to delete placements", {
        timeout: 1000,
      });
    }
  };

  const handlePlacementRecords = async () => {
    // set slectedRowIds value to each placements uid if selectedKeys equals "all" else set it with the selected keys
    const selectedRowIds =
      selectedKeys === "all"
        ? placements.map((placement) => placement.uid)
        : Array.from(selectedKeys);
    // now send these id through a function call to backend to delete them
    const data = {
      rows: selectedRowIds,
      token: user.accessToken,
    };

    try {
      const res = await fetch(
        `${cons.BASE_SERVER_URL}/moveToPlacementRecords`,
        {
          method: "delete",
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const resJson = await res.json();
      // show a toast msg
      if (resJson.code === "success") {
        ToastQueue.positive(resJson.message, {
          timeout: 1000,
        });
      } else {
        ToastQueue.negative(resJson.message, {
          timeout: 1000,
        });
      }
    } catch (error) {
      console.error("failed to move placements");
      console.error(error);
      // show a toast msg
      ToastQueue.negative("Failed to move placements", {
        timeout: 1000,
      });
    }
  };

  const handleSwitch = async (item) => {
    const docRef = doc(db, cons.DB.COLLECTIONS.PLACEMENTS, item.id);
    try {
      await updateDoc(docRef, { isActive: !item.isActive });
    } catch (error) {
      ToastQueue.negative(
        "Error setting active status of the placement Drive.",
        { timeout: 1000 }
      );
    }
  };

  const downloadExcelSheet = async (studentsApplied, placementDriveName) => {
    try {
      const queryParams = new URLSearchParams({
        students: studentsApplied.join(","),
        placementDriveName: placementDriveName,
      });
      const res = await fetch(
        `${cons.BASE_SERVER_URL}/downloadExcelSheet?${queryParams}`
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
        throw new error("Error downloading excel sheet");
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
      <SearchField
        label="Search"
        onSubmit={handleFilter}
        width="size-3600"
        onChange={handleSearchChange}
        onClear={() => list.setFilterText("")}
      />
      <ActionBarContainer height={"100%"} maxWidth={"100%"}>
        <TableView
          aria-label="Placements"
          width={"98%"}
          maxHeight={"98%"}
          sortDescriptor={list.sortDescriptor}
          onAction={handleRowAction}
          selectionMode="multiple"
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
        <ActionBar
          isEmphasized
          selectedItemCount={selectedKeys === "all" ? "all" : selectedKeys.size}
          onAction={handleActionbarAction}
          onClearSelection={() => setSelectedKeys(new Set())}
        >
          <Item key="delete">
            <Delete />
            <Text>Delete</Text>
          </Item>
        </ActionBar>
      </ActionBarContainer>
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
      <DialogContainer onDismiss={() => setDeleteConfirmation(null)}>
        {deleteConfirmation && (
          <Dialog isDismissable>
            <Heading>Confirm Delete Option</Heading>
            <Divider />
            <Content>
              <Grid columns={["1fr", "1fr"]} marginBottom={"size-300"}>
                <Heading level={4}>Permanently delete Placement Drive:</Heading>
                <Button
                  variant="negative"
                  style="fill"
                  onPress={handlePermanentDeletion}
                >
                  <Delete />
                  <Text>Delete Permanently</Text>
                </Button>
              </Grid>
              <Divider size="M" />
              <Grid columns={["1fr", "1fr"]} marginTop={"size-200"}>
                <Heading level={4}>
                  Move the Placement drive to the records:
                </Heading>
                <Button variant="primary" onPress={handlePlacementRecords}>
                  <Delete />
                  <Text>Delete but keep the records</Text>
                </Button>
              </Grid>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </Flex>
  );
}

export default PlacementDriveDetalis;
