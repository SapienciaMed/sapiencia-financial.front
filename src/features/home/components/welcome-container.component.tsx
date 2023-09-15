import React from "react";

function WelcomeContainer(): React.JSX.Element {

  return (
    <section className="welcome-container">
      <span className="text-dasboard huge text-center">Bienvenid@ al</span>
    </section>
  );
}

export default React.memo(WelcomeContainer);
