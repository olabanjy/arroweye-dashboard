import React from "react";
import DashboardLayout from "../dashboard/layout";
import Schedule from "./component/Schedule";

const SchedulePage = () => {
  return (
    <DashboardLayout>
      <Schedule
        isDateClickEnabled={true}
        isProjectPage={false}
        isSchedulePage={true}
      />
    </DashboardLayout>
  );
};

export default SchedulePage;
