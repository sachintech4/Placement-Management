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
} from "@adobe/react-spectrum";
import { useAsyncList } from "react-stately";
import useStudents from "../hooks/useStudents";

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
    async load({ signal }) {
      const prepareRows = () => {
        const studentRows = students.map((sr, index) => ({
          id: index,
          rollNo: sr.rollNo,
          name: `${sr.firstName} ${sr.lastName}`,
          contact: sr.contactNumber ?? "Not available",
          placementStatus: sr.isPlaced ? "Placed" : "Not placed",
          email: sr.email,
        }));
        if (studentRows) return studentRows;
        return [];
      };
      return {
        items: prepareRows(),
      };
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

  useEffect(() => {
    list.reload();
  }, [students]);

  return (
    <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
      <SearchField
        label="Search"
        onSubmit={(text) => {
          console.log(text);
        }}
        width="size-3600"
      />
      <TableView
        aria-label="Students"
        width={"98%"}
        maxHeight={"98%"}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
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
    </Flex>
  );
}

export default StudentList;
