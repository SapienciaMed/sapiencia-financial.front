

export interface ICautation {
    id:                 number;
    rpId:               number;
    amountCdpId:        number;
    initialAmount:      number;
    isActive:           number;
    reasonCancellation: string;
    position:           null;
    creditAmount:       null;
    againtsAmount:      null;
    fixedCompleted:     null;
    finalAmount:        null;
    pagos:              Pago[];
    totalValorPagado:   number;
    totalValorCausado:  number;
    total:              number;
}

export interface Pago {
    id:                number;
    vinculacionRpCode: number;
    valorCausado:      string;
    valorPagado:       string;
    usuarioCreo:       string;
    fechaCreo:         Date;
}

export interface Operation {
    code: string;
}
