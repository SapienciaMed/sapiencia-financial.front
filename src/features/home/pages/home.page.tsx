import React from "react";
import WelcomeContainerComponent from "../components/welcome-container.component";
import ApplicationsContainerComponent from "../components/applications-container.component";


interface IAppProps { }

function HomePage(props: IAppProps) {
  return (
    <div className="dashboard-margin full-height">
      <div style={{marginTop: '10%'}}>
        <WelcomeContainerComponent />
        <ApplicationsContainerComponent />
      </div>
    </div>
  );
}

export default React.memo(HomePage);
