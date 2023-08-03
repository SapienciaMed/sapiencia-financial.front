import React, { Fragment } from "react";
import { useApplicationsData } from "../hooks/applications-container.hook";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";
import { useNavigate } from "react-router-dom";

function ApplicationCardComponent() {
  const navigate = useNavigate();
  const { applications } = useApplicationsData();
  return <Fragment>
    {
      applications.map((app: IMenuAccess) => {
        let imagePath: string | undefined;
        try {
          imagePath = require(`../../../public/images/application-image-${app.id}.png`);
        } catch {
          imagePath = require('../../../public/images/application-image-default.png');
        }
        return (
          <div className="card-body" key={app.id} onClick={() => { navigate(`${window.location.pathname}${app.url}`) }}>
            <div className="card-header">
              <img
                src={imagePath}
              />
            </div>
            <div className="card-footer">
              <p className="text-dasboard-name-applications big text-center weight-500">{app.name}</p>
            </div>
          </div>
        );
      })
    }
  </Fragment>
};

function ApplicationsContainer(): React.JSX.Element {
  return (
    <section className="applications-cards">
      <ApplicationCardComponent />
    </section>
  );
}

export default React.memo(ApplicationsContainer);
