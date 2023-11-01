import React from "react";
import HomeReports from "../components/home";

const Reports = () => {
  return (
    <div className="main-page">
      <div className="card-table gap-0">
        <section className="title-area">
          <div className="text-black weight-500 extra-large">Reportes</div>
        </section>
        <section className="card-user">
          <HomeReports />
        </section>
      </div>
    </div>
  );
};

export default Reports;
