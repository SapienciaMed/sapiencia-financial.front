import React from "react";

function WelcomeContainer(): React.JSX.Element {

  return (
    <section className="welcome-container">
      <span className="text-main huge text-center bold">Bienvenid@ al Sistema de Información</span>
      <span className="text-black large text-center ">
        Breve descripción o texto explicativo sobre funcionalidades del sistema
      </span>
    </section>
  );
}

export default React.memo(WelcomeContainer);
