import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { ITableAction, ITableElement } from "../interfaces/table.interfaces";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  Paginator,
  PaginatorNextPageLinkOptions,
  PaginatorPageChangeEvent,
  PaginatorPageLinksOptions,
  PaginatorPrevPageLinkOptions,
} from "primereact/paginator";
import { IPagingData } from "../utils/api-response";
import useCrudService from "../hooks/crud-service.hook";
import { EResponseCodes } from "../constants/api.enum";
import { classNames } from "primereact/utils";
import * as Icons from "react-icons/fa";

interface IProps<T> {
  url: string;
  title?: string;
  columns: ITableElement<T>[];
  actions?: ITableAction<T>[];
  searchItems?: object;
}

interface IRef {
  loadData: (newSearchCriteria?: object) => void;
}

const template = {
  layout:
    "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
  PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
    return (
      <button
        type="button"
        className={classNames(options.className, "border-round")}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className="p-3 table-previus"></span>
      </button>
    );
  },
  NextPageLink: (options: PaginatorNextPageLinkOptions) => {
    return (
      <button
        type="button"
        className={classNames(options.className, "border-round")}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className="p-3 table-next"></span>
      </button>
    );
  },
  PageLinks: (options: PaginatorPageLinksOptions) => {
    if (
      (options.view.startPage === options.page &&
        options.view.startPage !== 0) ||
      (options.view.endPage === options.page &&
        options.page + 1 !== options.totalPages)
    ) {
      const className = classNames(options.className, { "p-disabled": true });

      return (
        <span className={className} style={{ userSelect: "none" }}>
          ...
        </span>
      );
    }

    return (
      <button
        type="button"
        className={options.className}
        onClick={options.onClick}
      >
        {options.page + 1}
      </button>
    );
  },
  RowsPerPageDropdown: () => {
    return null;
  },
  CurrentPageReport: () => {
    return null;
  },
};

const TableComponent = forwardRef<IRef, IProps<any>>((props, ref) => {
  const { title, columns, actions, url } = props;

  // Declaraciones
  const { post } = useCrudService(null, url);
  useImperativeHandle(ref, () => ({
    loadData: loadData,
  }));

  // States
  const [charged, setCharged] = useState<boolean>(false);
  const [resultData, setResultData] = useState<IPagingData<any>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const [searchCriteria, setSearchCriteria] = useState<object>();

  // Metodo que hace la peticion para realizar la carga de datos
  async function loadData(
    newSearchCriteria?: object,
    currentPage?: number
  ): Promise<void> {
    setLoading(true);

    if (newSearchCriteria) {
      setSearchCriteria(newSearchCriteria);
    }

    const body = newSearchCriteria || searchCriteria || {};
    const res = await post<IPagingData<any>>(url, {
      ...body,
      page: currentPage || 1,
      perPage: perPage,
    });
    if (res.operation.code === EResponseCodes.OK) {
      setResultData(res.data);
    } else {
      // generar mensaje de error / advetencia
    }
    setLoading(false);
  }

  // Metodo que retorna el icono o nombre de la accion
  function getIconElement(icon: string, element: "name" | "src") {
    switch (icon) {
      case "Detail":
        return element == "name" ? "Detalle" : <Icons.FaEye fontSize="1.3em" />;
      case "Edit":
        return element == "name" ? (
          "Editar"
        ) : (
          <Icons.FaPencilAlt fontSize="1.3em" />
        );
      case "Delete":
        return element == "name" ? (
          "Eliminar"
        ) : (
          <Icons.FaTrashAlt fontSize="1.3em" />
        );
      default:
        return "";
    }
  }

  // Metodo que genera el elemento del icono
  const ActionComponent = (props: { row: any }): JSX.Element => {
    return (
      <div className="spc-table-action-button">
        {actions.map((action) => (
          <div key={action.icon} onClick={() => action.onClick(props.row)}>
            {getIconElement(action.icon, "src")}
          </div>
        ))}
      </div>
    );
  };

  // Metodo que alamacena el el estado del paginador
  function onPageChange(event: PaginatorPageChangeEvent): void {
    setPerPage(event.rows);
    setFirst(event.first);
    setPage(event.page);
  }

  useEffect(() => {
    if (charged) loadData(undefined, page + 1);
  }, [perPage, first, page]);

  useEffect(() => {
    setCharged(true);

    return () => {
      setCharged(false);
    };
  }, []);

  return (
    <div className="spc-common-table">
      {title && <div className="spc-table-title">{title}</div>}

      <DataTable
        className="spc-table full-height"
        value={resultData?.array || []}
        loading={loading}
        scrollable={true}
      >
        {columns.map((col) => (
          <Column
            key={col.fieldName}
            field={col.fieldName}
            header={col.header}
            body={col.renderCell}
            className={col.mobile ? "mobile-enabled" : "mobile-disabled"}
          />
        ))}

        {actions && (
          <Column
            className="spc-table-actions"
            header={
              <div>
                <div className="spc-header-title">Acciones</div>
                <div className="spc-header-subtitles text-main small">
                  {actions.map((action) => (
                    <div key={action.icon}>
                      {action.customName
                        ? action.customName
                        : getIconElement(action.icon, "name")}
                    </div>
                  ))}
                </div>
              </div>
            }
            body={(row) => <ActionComponent row={row} />}
          />
        )}
      </DataTable>

      <Paginator
        className="spc-table-paginator"
        template={template}
        first={first}
        rows={perPage}
        totalRecords={resultData?.meta?.total || 0}
        rowsPerPageOptions={[10, 20, 30, 100]}
        onPageChange={onPageChange}
      />
    </div>
  );
});

export default React.memo(TableComponent);
