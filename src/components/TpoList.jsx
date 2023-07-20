import React, { useState, useEffect, useMemo, useContext } from "react";
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
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import Delete from "@spectrum-icons/workflow/Delete";
import { ActionBar, ActionBarContainer } from "@react-spectrum/actionbar";
import UserEdit from "@spectrum-icons/workflow/UserEdit";
import { useAsyncList } from "react-stately";
import useTpos from "../hooks/useTpos";
import { debounce } from "../utils";
import { AuthUserContext } from "../contexts";
import cons from "../cons";

function TpoList() {
  const columns = useMemo(
    () => [
      { name: "Id", uid: "tpoId" },
      { name: "Name", uid: "name" },
      { name: "Email", uid: "email" },
      { name: "Contact", uid: "contact" },
    ],
    []
  );
  const tpos = useTpos();
  let collator = useCollator({ numeric: true });
  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        tpos.forEach((sr) => {
          const row = {
            id: sr.uid,
            tpoId: sr.id,
            name: `${sr.firstName} ${sr.lastName}`,
            contact: sr.contactNumber ?? "Not available",
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
  const user = useContext(AuthUserContext);

  useEffect(() => {
    list.reload();
  }, [tpos]);

  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });
  const handleRowAction = (key) => {
    const row = list.items.find((item) => item.id === key);
    const tpo = tpos.find((tpo) => tpo.id === row.tpoId);
    if (tpo) {
      setDetailsDialog(tpo);
    }
  };
  const handleActionbarAction = async (actionKey) => {
    if (actionKey === "delete") {
      // set slectedRowIds value to each tpos uid if selectedKeys equals "all" else set it with the selected keys
      const selectedRowIds =
        selectedKeys === "all"
          ? tpos.map((tpo) => tpo.uid)
          : Array.from(selectedKeys);
      // now send these id through a function call to backend to delete them
      const data = {
        rows: selectedRowIds,
        token: user.accessToken,
      };

      try {
        const res = await fetch(`${cons.BASE_SERVER_URL}/deleteTpos`, {
          method: "delete",
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
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
        console.error("failed to delete users");
        console.error(error);
        // show a toast msg
        ToastQueue.negative("Failed to delete tpos", {
          timeout: 1000,
        });
      }
    }
  };

  return (
    <Flex height="100%" width="100%" direction={"column"} gap={"size-200"}>
      <View paddingX="size-200" paddingTop={"size-200"}>
        <Flex gap={"size-125"}>
          <UserEdit />
          <Heading level={2}>View TPO</Heading>
        </Flex>
      </View>
      <Divider size="M" />
      <SearchField
        label="Search"
        onSubmit={handleFilter}
        width="size-3600"
        onChange={handleSearchChange}
        onClear={() => list.setFilterText("")}
      />
      <ActionBarContainer height={"100%"} maxWidth={"100%"}>
        <TableView
          aria-label="Tpos"
          width={"98%"}
          maxHeight={"98%"}
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
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
                allowsSorting={column.uid === "id"}
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
            <Heading>{`${detailsDialog.firstName} ${detailsDialog.lastName} (${detailsDialog.id})`}</Heading>
            <Divider />
            <Content>
              <Grid gap="size-200" columns={["1fr", "1fr"]}>
                <View>
                  <Heading level={4}>Email</Heading>
                  <Text>{detailsDialog.email}</Text>
                </View>
                <View>
                  <Heading level={4}>Contact No.</Heading>
                  <Text>{detailsDialog.contactNumber}</Text>
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
              </Grid>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </Flex>
  );
}

export default TpoList;
