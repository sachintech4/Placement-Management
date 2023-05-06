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
  Header,
  Heading,
  Text,
  Grid,
  View,
} from "@adobe/react-spectrum";
import { useAsyncList } from "react-stately";
import useStudents from "../hooks/useStudents";
import { debounce } from "../utils";

function StudentList() {
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
  const students = useStudents();
  let collator = useCollator({ numeric: true });
  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        students.forEach((sr, index) => {
          const row = {
            id: index,
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
    const student = students.find((student) => student.rollNo === row.rollNo);
    if (student) {
      console.log(student);
      setDetailsDialog(student);
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
        aria-label="Students"
        width={"98%"}
        maxHeight={"98%"}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        onAction={handleRowAction}
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
                  <Text>{detailsDialog.isPlaced ? "Placed" : "Not placed"}</Text>
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

export default StudentList;
