import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  ActionButton,
  View,
  Flex,
  Heading,
  Picker,
  Item,
  Well,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useAsyncList } from "react-stately";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { AuthUserContext } from "../contexts";
import cons from "../cons";
import useCompanies from "../hooks/useCompanies";

function AddNewPlacementDrive() {
  const [companyDescription, setCompanyDescription] = useState("");

  const user = useContext(AuthUserContext);
  const companies = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState(null);

  const list = useAsyncList({
    async load() {
      const prepareRows = () => {
        const rows = companies.map((cr) => ({
          id: cr.uid,
          companyName: cr.companyName,
          email: cr.email,
          location: cr.location,
        }));
        return rows;
      };
      let items = prepareRows();
      return { items };
    },
  });

  useEffect(() => {
    list.reload();
  }, [companies]);

  const handleCompanyChange = (value) => {
    const selectedCompany = companies.find((company) => company.uid === value);
    setSelectedCompany(selectedCompany);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const details = {
      companyName: selectedCompany.companyName,
      location: selectedCompany.location,
      email: selectedCompany.email,
      companyDescription: companyDescription,
    };

    const data = {
      details,
      token: user.accessToken,
    };

    // validation
    if (!details.companyName) {
      ToastQueue.negative("Please provide the Company Name", { timeout: 1000 });
      return;
    }
    if (!details.location) {
      ToastQueue.negative("Please provide the Location", { timeout: 1000 });
      return;
    }
    if (!details.email) {
      ToastQueue.negative("Please provide the Email", { timeout: 1000 });
      return;
    }
    if (!details.email.match(cons.REGEXS.VALID_EMAIL)) {
      ToastQueue.negative("Please provide a valid Email", { timeout: 1000 });
      return;
    }
    if (!details.companyDescription) {
      ToastQueue.negative("Please provide Company Description", {
        timeout: 1000,
      });
      return;
    }

    try {
      const opts = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const res = await fetch(
        `${cons.BASE_SERVER_URL}/addNewPlacementDrive`,
        opts
      );
      const resJson = await res.json();
      if (resJson.code === "success") {
        ToastQueue.positive(resJson.message, { timeout: 1000 });
      } else if (resJson.code === "failed") {
        ToastQueue.negative(resJson.message, { timeout: 1000 });
      }
    } catch (error) {
      console.error("some error occured");
    }
  };

  return (
    <Flex direction="column" alignItems="start" gap="size-200">
      <Heading level={2}>New Placement Drive</Heading>
      {list.isLoading ? (
        <p>Loading companies...</p>
      ) : list.items.length === 0 ? (
        <p>No companies available</p>
      ) : (
        <Picker
          label="Select a company"
          items={list.items}
          onSelectionChange={handleCompanyChange}
          width="size-2400"
        >
          {(item) => <Item>{item.companyName}</Item>}
        </Picker>
      )}
      {selectedCompany && (
        <View>
          <Flex gap={"size-200"}>
            <Well>Selected company: {selectedCompany.companyName}</Well>
            <Well>Company location: {selectedCompany.location}</Well>
            <Well>Company email: {selectedCompany.email}</Well>
          </Flex>
          <View>
            <ReactQuill
              onChange={setCompanyDescription}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  ["blockquote", "code-block"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ align: [] }],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "color",
                "background",
                "blockquote",
                "code-block",
                "list",
                "bullet",
                "align",
              ]}
              theme="snow"
            />
          </View>
          <View>
            <ActionButton>Submit</ActionButton>
          </View>
        </View>
      )}
    </Flex>
  );
}

export default AddNewPlacementDrive;
