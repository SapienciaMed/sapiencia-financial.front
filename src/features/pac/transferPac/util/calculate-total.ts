import { ICreateTransferPacForm } from "../../../managementCenter/transfer/interfaces/TransferAreaCrudInterface";

export const calculateTotalOrigen = (watchAll: ICreateTransferPacForm): number => {
  
  const values = watchAll?.origen?.map(use => {
  
    const {id, pacId, ...rest} = use.programmed
    const {id: idCollect, pacId: pacIdCollect, ...restCollected} = use.collected
  
    const programmed = Object.values(rest).reduce((acumulador, valor) => {
      const numericValue = parseFloat(valor);
      if (!isNaN(numericValue)) {
        return acumulador + numericValue;
      }
      return acumulador;
    }, 0);
    const collected = Object.values(restCollected).reduce((acumulador, valor) => {
      const numericValue = parseFloat(valor);
      if (!isNaN(numericValue)) {
        return acumulador + numericValue;
      }
      return acumulador;
    }, 0);

    return programmed + collected
  })

  const total =  values?.reduce((acc, curr) => {
    const value = curr
    return acc + (isNaN(value) ? 0 : value);
  },0)
  return total
};

export const calculateTotalDestino = (watchAll: ICreateTransferPacForm): number => {

  const values = watchAll?.destino?.map(use => {
    const {id, pacId, ...rest} = use.programmed
    const {id: idCollect, pacId: pacIdCollect, ...restCollected} = use.collected

    const programmed = Object.values(rest).reduce((acumulador, valor) => {
      const numericValue = parseFloat(valor);

      if (!isNaN(numericValue)) {
        return acumulador + numericValue;
      }
      return acumulador;
    }, 0);

    const collected = Object.values(restCollected).reduce((acumulador, valor) => {
      const numericValue = parseFloat(valor);
      if (!isNaN(numericValue)) {
        return acumulador + numericValue;
      }
      return acumulador;
    }, 0);

    return programmed + collected
  })
  
  const total =  values?.reduce((acc, curr) => {
      const value = curr
      return acc + (isNaN(value) ? 0 : value);
  },0)

  return total
}

export function calcularTotalOrigenLocation(arr2): number {
  return arr2?.filter(item => item.ubicacion === "origen")
    .reduce((total, item) => {
      const annualRouteService = item.annualRouteService;
      const suma = annualRouteService.reduce((subtotal, service) => {
        const { id, pacId, cardId, type, ...rest } = service;
        for (const prop in rest) {
          subtotal += rest[prop];
        }
        return subtotal;
      }, 0);
      return total + suma;
    }, 0) || 0
}


export function calculateTotalDestinoLocation(arr2): number {
  return arr2?.filter(item => item.ubicacion === "destino")
    .reduce((total, item) => {
      const annualRouteService = item.annualRouteService;
      const suma = annualRouteService.reduce((subtotal, service) => {
        const { id, pacId, cardId, type, ...rest } = service;
        for (const prop in rest) {
          subtotal += rest[prop];
        }
        return subtotal;
      }, 0);
      return total + suma;
    }, 0) || 0
}
