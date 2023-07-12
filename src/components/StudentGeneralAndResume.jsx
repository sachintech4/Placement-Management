import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Item,
  View,
  Text,
  Flex,
} from "@adobe/react-spectrum";
import StudentResume from "./StudentResume";
import StudentProfile from "./StudentProfile";
import StudentPlacementStatus from "./StudentsPlacementStatus";

function StudentGeneralAndResume() {
  return (
    <Tabs aria-label="General and Resume">
      <TabList>
        <Item key={"general"}>General</Item>
        <Item key={"resume"}>Resume</Item>
        {/* <Item key={"placementStatus"}>Placement Status</Item> */}
      </TabList>
      <TabPanels>
        <Item key={"general"}>
          <View paddingX="size-100" paddingY="size-400">
            <StudentProfile />
          </View>
        </Item>
        <Item key={"resume"}>
          <View paddingX="size-100" paddingY="size-400">
            <Flex direction={"column"} alignItems={"start"} gap="size-200">
              <StudentResume />
            </Flex>
          </View>
        </Item>
        {/* <Item key={"placementStatus"}>
          <View paddingX="size-100" paddingY="size-400">
            <StudentPlacementStatus />
          </View>
        </Item> */}
      </TabPanels>
    </Tabs>
  );
}

export default StudentGeneralAndResume;
