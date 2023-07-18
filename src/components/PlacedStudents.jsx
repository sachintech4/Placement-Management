import React, { useState, useEffect, useMemo } from "react";
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
  Button,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import Download from "@spectrum-icons/workflow/Download";
import { useAsyncList } from "react-stately";
import useStudents from "../hooks/useStudents";
import { debounce } from "../utils";
import cons from "../cons";

function PlacedStudents() {
  const columns = useMemo(
    () => [
      { name: "Roll No", uid: "rollNo" },
      { name: "Name", uid: "name" },
      { name: "Email", uid: "email" },
      { name: "Contact", uid: "contact" },
      //   { name: "Placement status", uid: "placementStatus" },
    ],
    []
  );
  const students = useStudents();
  const notPlacedStudents = students.filter((student) => !student.isPlaced);
  const placedStudents = students.filter((student) => student.isPlaced);
  let collator = useCollator({ numeric: true });
  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        placedStudents.forEach((sr) => {
          const row = {
            id: sr.uid,
            rollNo: sr.rollNo,
            name: `${sr.firstName} ${sr.lastName}`,
            contact: sr.contactNumber ?? "Not available",
            // placementStatus: sr.isPlaced ? "Placed" : "Not placed",
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
  const placedStudentsUids = placedStudents.map((student) => student.uid);
  const notPlacedStudentsUids = notPlacedStudents.map((student) => student.uid);

  useEffect(() => {
    list.reload();
  }, [students]);

  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });
  const handleRowAction = (key) => {
    const row = list.items.find((item) => item.id === key);
    const student = placedStudents.find(
      (student) => student.rollNo === row.rollNo
    );
    if (student) {
      setDetailsDialog(student);
    }
  };

  const downloadExcelSheet = async (studentUids, fileName) => {
    try {
      const queryParams = new URLSearchParams({
        students: studentUids.join(","),
        fileName: fileName,
      });
      const res = await fetch(
        `${cons.BASE_SERVER_URL}/downloadExcelSheetOfStudents?${queryParams}`
      );
      console.log(res.url);
      if (res.ok) {
        const link = document.createElement("a");
        link.href = res.url;
        link.donwload = `${fileName}.xlsx`;

        link.click();

        ToastQueue.positive(`Excel sheet for ${fileName} downloaded`, {
          timeout: 1000,
        });
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
      <View width="100%">
        <Flex>
          <SearchField
            label="Search"
            onSubmit={handleFilter}
            width="size-3600"
            onChange={handleSearchChange}
            onClear={() => list.setFilterText("")}
          />
          <View flexGrow={1} />
          <View justifySelf={"end"} alignSelf={"end"}>
            <Flex gap={"size-200"} ś>
              <Button
                onPress={() =>
                  downloadExcelSheet(placedStudentsUids, "Placed Students")
                }
              >
                <Download />
                <Text>Placed Students</Text>
              </Button>
              <Button
                onPress={() =>
                  downloadExcelSheet(
                    notPlacedStudentsUids,
                    "Not Placed Studnets"
                  )
                }
              >
                <Download />
                <Text>Not Placed Students</Text>
              </Button>
            </Flex>
          </View>
        </Flex>
      </View>
      <TableView
        aria-label="Students"
        width={"98%"}
        maxHeight={"98%"}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        onAction={handleRowAction}
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
          {(item) => <Row>{(columnKey) => <Cell>{item[columnKey]}</Cell>}</Row>}
        </TableBody>
      </TableView>
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
                  <Text>{`${detailsDialog.dob.day}/${detailsDialog.dob.month}/${detailsDialog.dob.year}`}</Text>
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
                  <Heading level={4}>Resume</Heading>
                  <Text>resume-downloader-placeholder</Text>
                </View>
                <View>
                  <Heading level={4}>Applied to</Heading>
                  <Text>companies-applied-to-placeholder</Text>
                </View>
              </Grid>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </Flex>
  );
}

export default PlacedStudents;
