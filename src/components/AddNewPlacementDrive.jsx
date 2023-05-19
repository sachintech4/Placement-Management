import React, { useContext, useState, useEffect } from "react";
import {
  Form,
  TextField,
  Grid,
  Button,
  View,
  Flex,
  Heading,
  Picker,
  Item,
} from "@adobe/react-spectrum";
import { ToastQueue } from "@react-spectrum/toast";
import { useAsyncList } from "react-stately";
import { AuthUserContext } from "../contexts";
import cons from "../cons";
import useCompanies from "../hooks/useCompanies";

function AddNewPlacementDrive() {
  const user = useContext(AuthUserContext);
  const companies = useCompanies();
  console.log(companies);

  const [selectedCompany, setSelectedCompany] = useState(null);

  const list = useAsyncList({
    async load({ signal, filterText }) {
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
      console.log(items);
      return { items };
    },
  });

  useEffect(() => {
    list.reload();
  }, [companies]);

  const handleCompanyChange = (value) => {
    const selectedCompany = companies.find((company) => company.uid === value);
    setSelectedCompany(selectedCompany);
    console.log(selectedCompany);
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const form = e.target;
  //     const formData = new FormData(form);

  //     const PlacementDriveName = formData.get("placement-drive-name").trim();

  //     const details = {
  //       companyName: companyName,
  //       location: location,
  //       email: email,
  //     };

  //     const data = {
  //       details,
  //       token: user.accessToken,
  //     };

  //     // validation
  //     if (!details.companyName) {
  //       ToastQueue.negative("Please provide the Company Name", { timeout: 1000 });
  //       return;
  //     }
  //     if (!details.location) {
  //       ToastQueue.negative("Please provide the Location", { timeout: 1000 });
  //       return;
  //     }
  //     if (!details.email) {
  //       ToastQueue.negative("Please provide the Email", { timeout: 1000 });
  //       return;
  //     }
  //     if (!details.email.match(cons.REGEXS.VALID_EMAIL)) {
  //       ToastQueue.negative("Please provide a valid Email", { timeout: 1000 });
  //       return;
  //     }

  //     try {
  //       const opts = {
  //         method: "post",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       };

  //       const res = await fetch(
  //         `${cons.BASE_SERVER_URL}/addNewPlacementDrive`,
  //         opts
  //       );
  //       const resJson = await res.json();
  //       if (resJson.code === "success") {
  //         ToastQueue.positive(resJson.message, { timeout: 1000 });
  //       } else if (resJson.code === "failed") {
  //         ToastQueue.negative(resJson.message, { timeout: 1000 });
  //       }
  //     } catch (error) {
  //       console.error("some error occured");
  //     }
  //   };

  return (
    <Flex direction="column" alignItems="start" gap="size-200">
      <Heading level={2}>Company Dropdown</Heading>
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
        <div>
          <p>Selected company: {selectedCompany.companyName}</p>
          <p>Company location: {selectedCompany.location}</p>
          <p>Company email: {selectedCompany.email}</p>
          {/* Store the selectedCompany reference object or perform any other actions */}
        </div>
      )}
    </Flex>
  );
}

export default AddNewPlacementDrive;
