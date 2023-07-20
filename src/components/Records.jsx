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
import DataUser from "@spectrum-icons/workflow/DataUser";
import { useAsyncList } from "react-stately";
import { debounce } from "../utils";
import useRecords from "../hooks/useRecords";
import useBatch from "../hooks/useBatch";

function Records() {
  const columns = useMemo(
    () => [
      { name: "Roll No", uid: "rollNo" },
      { name: "Name", uid: "name" },
      { name: "Email", uid: "email" },
      { name: "Contact", uid: "contact" },
      { name: "Placement status", uid: "placementStatus" },
    ],
    []
  );

  const [batchYear, setBatchYear] = useState(null);
  const records = useRecords();
  const recordYears = records.map((item) => item.uid);
  const batch = useBatch(batchYear);

  let collator = useCollator({ numeric: true });
  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        batch.forEach((sr) => {
          const row = {
            id: sr.uid,
            rollNo: sr.rollNo,
            name: `${sr.firstName} ${sr.lastName}`,
            contact: sr.contactNumber ?? "Not available",
            placementStatus: sr.isPlaced ? "Placed" : "Not placed",
            email: sr.email,
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
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp = collator.compare(first, second);
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  const [detailsDialog, setDetailsDialog] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  // const [placementsAppliedTo, setPlacementsAppliedTo] = useState(null);

  useEffect(() => {
    list.reload();
  }, [batch]);

  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });
  const handleRowAction = (key) => {
    const row = list.items.find((item) => item.id === key);
    const selectedBatch = batch.find(
      (selectedBatch) => selectedBatch.rollNo === row.rollNo
    );
    if (selectedBatch) {
      setDetailsDialog(selectedBatch);
    }
  };
  // useEffect(() => {
  //   if (detailsDialog) {
  //     const filterPlacements = batch.filter((batch) =>
  //       detailsDialog.placementsAppliedTo.includes(batch.uid)
  //     );
  //     setPlacementsAppliedTo(filterPlacements);
  //   }
  // }),
  //   [detailsDialog];

  return (
    <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
      <View paddingX="size-200" paddingTop="size-200">
        <Flex gap={"size-125"}>
          <DataUser />
          <Heading level={2}>Student Records</Heading>
        </Flex>
      </View>
      <Divider size="M" />
      <Picker
        label="Select Batch"
        items={recordYears}
        onSelectionChange={setBatchYear}
      >
        {recordYears.map((item) => (
          <Item key={item}>{item}</Item>
        ))}
      </Picker>
      <View>
        <Divider size="M" />
      </View>
      <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
        <SearchField
          label="Search"
          onSubmit={handleFilter}
          width="size-3600"
          onChange={handleSearchChange}
          onClear={() => list.setFilterText("")}
        />
        {/* <ActionBarContainer height={"100%"} maxWidth={"100%"}> */}
        <TableView
          aria-label="Students"
          width={"98%"}
          maxHeight={"98%"}
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
          onAction={handleRowAction}
          // selectionMode={role.type === "admin" ? "multiple" : "none"}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <Column
                key={column.uid}
                allowsResizing
                allowsSorting={column.uid === "rollNo"}
              >
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={list.items} loadingState={list.loadingState}>
            {(item) => (
              <Row>{(columnKey) => <Cell>{item[columnKey]}</Cell>}</Row>
            )}
          </TableBody>
        </TableView>
        {/* <ActionBar
            isEmphasized
            selectedItemCount={
              selectedKeys === "all" ? "all" : selectedKeys.size
            }
            // onAction={handleActionbarAction}
            onClearSelection={() => setSelectedKeys(new Set())}
          >
            <Item key="delete">
              <Delete />
              <Text>Delete</Text>
            </Item>
          </ActionBar> */}
        {/* </ActionBarContainer> */}
        <DialogContainer onDismiss={() => setDetailsDialog(null)}>
          {detailsDialog && (
            <Dialog isDismissable>
              <Heading>{`${detailsDialog.firstName} ${detailsDialog.lastName} (${detailsDialog.rollNo})`}</Heading>
              <Divider />
              <Content>
                <Grid gap="size-200" columns={["1fr", "1fr"]}>
                  <View>
                    <Heading level={4}>PRN</Heading>
                    <Text>{detailsDialog.prn}</Text>
                  </View>
                  <View>
                    <Heading level={4}>Email</Heading>
                    <Text>{detailsDialog.email}</Text>
                  </View>
                  <View>
                    <Heading level={4}>Gender</Heading>
                    <Text>{detailsDialog.gender}</Text>
                  </View>
                  <View>
                    <Heading level={4}>Date of Birth</Heading>
                    {typeof detailsDialog.dob === "string" ? (
                      <Text>{detailsDialog.dob}</Text>
                    ) : (
                      <Text>{`${detailsDialog.dob.day}/${detailsDialog.dob.month}/${detailsDialog.dob.year}`}</Text>
                    )}
                  </View>
                  <View>
                    <Heading level={4}>Batch</Heading>
                    <Text>{detailsDialog.batch ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>Placement Status</Heading>
                    <Text>
                      {detailsDialog.isPlaced ? "Placed" : "Not placed"}
                    </Text>
                  </View>
                  <View>
                    <Heading level={4}>10th percentage</Heading>
                    <Text>{detailsDialog.tenthPercentage ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>10th Year of passing</Heading>
                    <Text>{detailsDialog.tenthYearOfPassing ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>12th percentage</Heading>
                    <Text>{detailsDialog.twelfthPercentage ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>12th Year of passing</Heading>
                    <Text>{detailsDialog.twelfthYearOfPassing ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>UG CGPA</Heading>
                    <Text>{detailsDialog.ugCgpa ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>UG Year of passing</Heading>
                    <Text>{detailsDialog.ugYearOfPassing ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>PG CGPA</Heading>
                    <Text>{detailsDialog.pgCgpa ?? "-"}</Text>
                  </View>
                  <View>
                    <Heading level={4}>PG Year of passing</Heading>
                    <Text>{detailsDialog.pgYearOfPassing ?? "-"}</Text>
                  </View>
                  <View>
                    {detailsDialog.resume ? (
                      <Button
                        marginTop={"size-100"}
                        onPress={() => window.open(detailsDialog.resume)}
                      >
                        Resume
                      </Button>
                    ) : (
                      <>
                        <Heading level={4}>Resume</Heading>
                        <Text>Resume not uploaded</Text>
                      </>
                    )}
                  </View>
                  {/* <View>
                    <Heading level={4}>Applied to</Heading>
                    <View>
                      <Text>
                        {placementsAppliedTo ? (
                          placementsAppliedTo.length > 0 ? (
                            placementsAppliedTo
                              .map((placement) => placement.companyName)
                              .join(", ")
                          ) : (
                            <Text>No Placemnent Applied</Text>
                          )
                        ) : (
                          <Text>Loading...</Text>
                        )}
                      </Text>
                    </View>
                  </View> */}
                </Grid>
              </Content>
            </Dialog>
          )}
        </DialogContainer>
        {/* <DialogContainer onDismiss={() => setDeleteConfirmation(null)}>
          {deleteConfirmation && (
            <Dialog isDismissable>
              <Heading>Confirm Delete Option</Heading>
              <Divider />
              <Content>
                <Grid columns={["1fr", "1fr"]} marginBottom={"size-300"}>
                  <Heading level={4}>
                    Permanently delete users and their corresponding records:
                  </Heading>
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
                    Delete users but move their information to records:
                  </Heading>
                  <Button variant="primary" onPress={handleDeletionAndMoveData}>
                    <Delete />
                    <Text>Keep the records</Text>
                  </Button>
                </Grid>
              </Content>
            </Dialog>
          )}
        </DialogContainer> */}
      </Flex>
    </Flex>
  );
}

export default Records;
