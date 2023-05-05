import React, { useState, useEffect, useMemo } from "react";
import {
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  View,
  SearchField,
  Flex,
} from "@adobe/react-spectrum";
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
  const [rows, setRows] = useState([]);
  const students = useStudents();

  useEffect(() => {
    const prepareRows = () => {
      const studentRows = students.map((sr, index) => ({
        id: index,
        rollNo: sr.rollNo,
        name: `${sr.firstName} ${sr.lastName}`,
        contact: sr.contactNumber ?? "Not available",
        placementStatus: sr.isPlaced ? "Placed" : "Not placed",
        email: sr.email,
      }));
      if (studentRows) setRows(studentRows);
    };
    prepareRows();
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
      <TableView aria-label="Students" width={"98%"} maxHeight={"98%"}>
        <TableHeader columns={columns}>
          {(column) => (
            <Column
              key={column.uid}
              allowsResizing
              allowsSorting={column.uid === "rollNo" || column.uid === "placementStatus"}
            >
              {column.name}
            </Column>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => <Row>{(columnKey) => <Cell>{item[columnKey]}</Cell>}</Row>}
        </TableBody>
      </TableView>
    </Flex>
  );
}

export default StudentList;
