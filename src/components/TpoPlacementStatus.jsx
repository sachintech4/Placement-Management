import React, { useContext, useState, useEffect, useMemo } from "react";
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
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { doc, updateDoc, getDoc } from "@firebase/firestore";
import Delete from "@spectrum-icons/workflow/Delete";
import ViewDetail from "@spectrum-icons/workflow/ViewDetail";
import { useAsyncList } from "react-stately";
import { db } from "../firebase-config";
import { debounce } from "../utils";
import cons from "../cons";
import useStudents from "../hooks/useStudents";
import usePlacements from "../hooks/usePlacements";
import useCompanies from "../hooks/useCompanies";

function TpoPlacementStatus() {
  const columns = useMemo(
    () => [
      { name: "Roll No", uid: "rollNo" },
      { name: "Name", uid: "studentName" },
      { name: "Company Name", uid: "companyName" },
      { name: "CTC", uid: "salaryPackage" },
      { name: "Offer Letter", uid: "offerLetter" },
      { name: "Approve", uid: "approve" },
      { name: "Decline", uid: "decline" },
    ],
    []
  );

  const students = useStudents();
  const placements = usePlacements();
  const companies = useCompanies();
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const studentApplications = students.filter((student) => {
    return student.offerLetter !== null && !student.isPlaced;
  });

  let collator = useCollator({ numeric: true });
  const list = useAsyncList({
    async load() {
      const prepareRows = () => {
        const rows = studentApplications.map((st) => ({
          id: st.uid,
          rollNo: st.rollNo,
          studentName: `${st.firstName} ${st.lastName}`,
          companyName: st.tempCompany.companyName,
          salaryPackage: st.tempSalaryPackage,
          companyUid: st.tempCompany.companyUid,
          offerLetterLink: st.offerLetter,
        }));
        return rows;
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
    const student = studentApplications.find(
      (student) => student.rollNo === row.rollNo
    );
    if (student) {
      setDetailsDialog(student);
    }
  };

  const approveOfferLetter = async (id, companyUid, salaryPackage) => {
    const placement = placements.find(
      (placement) => placement.companyUid === companyUid
    );
    const studentDocRef = doc(db, cons.DB.COLLECTIONS.USERS_STUDENT, id);
    const placementDocumentRef = doc(
      db,
      cons.DB.COLLECTIONS.PLACEMENTS,
      placement.uid
    );

    const placementDoc = await getDoc(placementDocumentRef);
    try {
      const placementData = placementDoc.data();
      const studentsPlaced = placementData.studentsPlaced || [];

      await updateDoc(studentDocRef, {
        isPlaced: true,
        isPlacedAt: {
          comapanyUid: placement.companyUid,
          companyName: placement.companyName,
        },
        salaryPackage: salaryPackage,
        revokeOfferLetter: null,
      });

      await updateDoc(placementDocumentRef, {
        studentsPlaced: [...studentsPlaced, id],
      });
    } catch (error) {
      console.error("Error updating student's and placemnet's field", error);
    }
  };

  const declineOfferLetter = async (id) => {
    const studentDocRef = doc(db, cons.DB.COLLECTIONS.USERS_STUDENT, id);

    try {
      await updateDoc(studentDocRef, {
        offerLetter: null,
        revokeOfferLetter: true,
      });
    } catch (error) {
      console.error("Error declining students's placemnt request", error);
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
            <Row>
              {(columnKey) => {
                if (columnKey === "offerLetter") {
                  return (
                    <Cell>
                      <Button
                        gridArea={"view"}
                        variant="primary"
                        onPress={() => window.open(item.offerLetterLink)}
                      >
                        <ViewDetail />
                        <Text>View</Text>
                      </Button>
                    </Cell>
                  );
                } else if (columnKey === "approve") {
                  return (
                    <Cell>
                      <Button
                        variant="primary"
                        style="fill"
                        onPress={() => {
                          approveOfferLetter(
                            item.id,
                            item.companyUid,
                            item.salaryPackage
                          );
                        }}
                      >
                        Approve
                      </Button>
                    </Cell>
                  );
                } else if (columnKey === "decline") {
                  return (
                    <Cell>
                      <Button
                        variant="secondary"
                        style="fill"
                        onPress={() => {
                          declineOfferLetter(item.id);
                        }}
                      >
                        Decline
                      </Button>
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
    </Flex>
  );
}

export default TpoPlacementStatus;
