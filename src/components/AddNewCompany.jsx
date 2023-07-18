import React, { useContext } from "react";
import {
  Form,
  TextField,
  Grid,
  Button,
  View,
  Flex,
  Heading,
  Divider,
} from "@adobe/react-spectrum";
import CollectionAdd from "@spectrum-icons/workflow/CollectionAdd";
import { ToastQueue } from "@react-spectrum/toast";
import { AuthUserContext } from "../contexts";
import cons from "../cons";
import useCompanies from "../hooks/useCompanies";

function AddNewCompany() {
  const user = useContext(AuthUserContext);
  const companies = useCompanies();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const companyName = formData.get("company-name").trim();
    const location = formData.get("location").trim();
    const email = formData.get("email").trim();

    const details = {
      companyName: companyName,
      location: location,
      email: email,
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
    const isCompanyExist = companies.some(
      (company) => company.companyName === companyName
    );
    if (isCompanyExist) {
      ToastQueue.negative("Company already exists", { timeout: 1000 });
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

      const res = await fetch(`${cons.BASE_SERVER_URL}/addNewCompany`, opts);
      const resJson = await res.json();
      if (resJson.code === "success") {
        ToastQueue.positive(resJson.message, { timeout: 1000 });
        form.reset();
      } else if (resJson.code === "failed") {
        ToastQueue.negative(resJson.message, { timeout: 1000 });
      }
    } catch (error) {
      console.error("some error occured");
    }
  };

  return (
    <Flex direction="column" alignItems="start" gap={"size-200"}>
      <View paddingX="size-200" paddingTop="size-200">
        <Flex gap={"size-125"}>
          <CollectionAdd />
          <Heading level={2}>Add new company</Heading>
        </Flex>
      </View>
      <Divider size="M" />
      <View
        padding="size-250"
        width="fit-content"
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
      >
        <Form onSubmit={handleSubmit} isRequired>
          <Grid
            areas={["company-name location", "email email"]}
            columns={"1fr 1fr"}
            alignItems={"end"}
            gap={"size-200"}
          >
            <TextField
              label="Company Name"
              gridArea={"company-name"}
              name="company-name"
            />
            <TextField label="Location" gridArea={"location"} name="location" />
            <TextField
              label="Email"
              gridArea={"email"}
              width="100%"
              name="email"
            />
            <View gridArea={"buttons"}>
              <Button type="submit">Add</Button>
            </View>
          </Grid>
        </Form>
      </View>
    </Flex>
  );
}

export default AddNewCompany;
