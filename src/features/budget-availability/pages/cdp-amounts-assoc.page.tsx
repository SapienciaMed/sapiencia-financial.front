import React from "react";

const CdpAmountAssoc = () => {
    const currentUrl = window.location.href;
    const segments = currentUrl.split('/');
    const lastSegment = segments[segments.length - 1];

    return (
        <div>
            <p>Hola, este es el asociar</p>
            <p>La URL actual es: {currentUrl}</p>
            <p>El último parámetro es: {lastSegment}</p>
        </div>
    );
};

export default CdpAmountAssoc;
