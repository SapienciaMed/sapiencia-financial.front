import React, { useContext, useEffect } from "react";
import WelcomeContainerComponent from "../components/welcome-container.component";
import ApplicationsContainerComponent from "../components/applications-container.component";


interface IAppProps {}

function HomePage(props: IAppProps) {
  return (
    <div className="dashboard-margin full-height">
      <WelcomeContainerComponent />
      <ApplicationsContainerComponent />
    </div>
  );
}

export default React.memo(HomePage);
