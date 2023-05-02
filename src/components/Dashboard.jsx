import React, { useContext, useEffect, useState } from "react";
import { Grid } from "@adobe/react-spectrum";
import { AuthUserContext } from "../contexts";
import cons from "../cons";
import Sidebar from "./Sidebar";
import Content from "./Content";

const users = Object.values(cons.USERS);

function Dashboard() {
  const authUser = useContext(AuthUserContext);
  const [role, setRole] = useState(null);
  const [selectedSidebarOption, setSidebarOption] = useState(null);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      if (authUser) {
        const tokenResult = await authUser.getIdTokenResult();
        const authRole = tokenResult.claims.role;
        const _role = users.find((r) => r.type === authRole);
        setRole(_role);
      }
    };
    fetchUserDashboard();
  }, [authUser]);
  
  return (
    <Grid
      height="100%"
      areas={["sidebar content"]}
      columns={["size-3600", "auto"]}
    >
      <Sidebar
        gridArea="sidebar"
        role={role}
        onOptionSelect={setSidebarOption}
      />
      <Content
        gridArea="content"
        role={role}
        selectedSidebarOption={selectedSidebarOption}
      />
    </Grid>
  )
}

export default Dashboard;
