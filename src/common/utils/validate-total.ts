import { ICreateSourceForm } from "../../features/managementCenter/transfer/interfaces/TransferAreaCrudInterface";

export const get_total_value = (data: ICreateSourceForm) => {
    const dest = data.destino.sort((a, b) => parseInt(a.value) - parseInt(b.value)).reduce((total, item) => total + parseInt(item.value), 0);
    const orig = data.origen.sort((a, b) => parseInt(a.value) - parseInt(b.value)).reduce((total, item) => total + parseInt(item.value), 0);
    
    const valid = dest == orig
    return valid;
};

export const isTotalSame = (data): boolean => {
    const total_by_type_transfer = { Origen: 0, Destino: 0 };

    data?.reduce((acc, item) => {
      const type_transfer = item.typeTransfer;

      if (!acc[type_transfer]) {
        acc[type_transfer] = 0;
      }

      acc[type_transfer] += parseFloat(item.value);

      return acc;
    }, total_by_type_transfer);

    return total_by_type_transfer.Destino == total_by_type_transfer.Origen;
};
