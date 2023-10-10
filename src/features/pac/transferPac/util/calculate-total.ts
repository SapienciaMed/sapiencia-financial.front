import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";

export const calculateTotalOrigen = (watchAll: ICreateTransferPacForm) => {
  const values = watchAll?.origen?.map(use => {
    const programmed = Object.values(use?.programmed).reduce((acumulador, valor) => {
      const numericValue = parseFloat(valor);
      if (!isNaN(numericValue)) {
        return acumulador + numericValue;
      }
      return acumulador;
    }, 0);
    const collected = Object.values(use?.collected).reduce((acumulador, valor) => {
      const numericValue = parseFloat(valor);
      if (!isNaN(numericValue)) {
        return acumulador + numericValue;
      }
      return acumulador;
    }, 0);

    return parseFloat(programmed) + parseFloat(collected)
  })

  const total =  values?.reduce((acc, curr) => {
    const value = curr
    return acc + (isNaN(value) ? 0 : value);
  },0)

    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  };

export const calculateTotalDestino = (watchAll: ICreateTransferPacForm) => {
    const values = watchAll?.destino?.map(use => {
      const programmed = Object.values(use?.programmed).reduce((acumulador, valor) => {
        const numericValue = parseFloat(valor);
        if (!isNaN(numericValue)) {
          return acumulador + numericValue;
        }
        return acumulador;
      }, 0);
      const collected = Object.values(use?.collected).reduce((acumulador, valor) => {
        const numericValue = parseFloat(valor);
        if (!isNaN(numericValue)) {
          return acumulador + numericValue;
        }
        return acumulador;
      }, 0);

      return parseFloat(programmed) + parseFloat(collected)
    })
    const total =  values?.reduce((acc, curr) => {
        const value = curr
        return acc + (isNaN(value) ? 0 : value);
    },0)

    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
};