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
import { ActionBar, ActionBarContainer } from "@react-spectrum/actionbar";
import { ToastQueue } from "@react-spectrum/toast";
import Delete from "@spectrum-icons/workflow/Delete";
import { useAsyncList } from "react-stately";
import useCompanies from "../hooks/useCompanies";
import { debounce } from "../utils";
import { AuthUserContext } from "../contexts";
import cons from "../cons";

function ShowCompanies() {
  const companies = useCompanies();

  const columns = useMemo(() => [
    { name: "Company Name", uid: "companyName" },
    { name: "Email", uid: "email" },
    { name: "Location", uid: "location" },
  ]);

  const list = useAsyncList({
    async load({ signal, filterText }) {
      const prepareRows = () => {
        const filteredAndNormalisedItems = [];
        companies.forEach((cr) => {
          const row = {
            id: cr.uid,
            companyName: cr.companyName,
            email: cr.email,
            location: cr.location,
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

  const [detailsDialog, setDetailsDialog] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const user = useContext(AuthUserContext);

  useEffect(() => {
    list.reload();
  }, [companies]);

  const handleFilter = (text) => {
    list.setFilterText(text.trim());
  };
  const handleSearchChange = debounce((text) => {
    list.setFilterText(text.trim());
  });
  const handleRowAction = (key) => {
    const row = list.items.find((item) => item.id === key);
    const company = companies.find(
      (company) => company.companyName === row.companyName
    );
    if (company) {
      setDetailsDialog(company);
    }
  };

  const handleActionbarAction = async (actionKey) => {
    if (actionKey === "delete") {
      // set slectedRowIds value to each companies uid if selectedKeys equals "all" else set it with the selected keys
      const selectedRowIds =
        selectedKeys === "all"
          ? companies.map((company) => company.uid)
          : Array.from(selectedKeys);
      // now send these id through a function call to backend to delete them
      const data = {
        rows: selectedRowIds,
        token: user.accessToken,
      };

      try {
        const res = await fetch(`${cons.BASE_SERVER_URL}/deleteCompanies`, {
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
        console.error("failed to delete companies");
        console.error(error);
        // show a toast msg
        ToastQueue.negative("Failed to delete companies", {
          timeout: 1000,
        });
      }
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
          aria-label="Companies"
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
                // allowsSorting={column.uid === "rollNo"}
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
            <Heading>{`${detailsDialog.companyName})`}</Heading>
            <Divider />
            <Content>
              <Grid gap="size-200" columns={["1fr", "1fr"]}>
                <View>
                  <Heading level={4}>Email</Heading>
                  <Text>{detailsDialog.email}</Text>
                </View>
                <View>
                  <Heading level={4}>Location</Heading>
                  <Text>{detailsDialog.location}</Text>
                </View>
                <View>
                  <Heading level={4}>Placed Students</Heading>
                  <Text>{detailsDialog.placedStudents}</Text>
                </View>
              </Grid>
            </Content>
          </Dialog>
        )}
      </DialogContainer>
    </Flex>
  );
}

export default ShowCompanies;
