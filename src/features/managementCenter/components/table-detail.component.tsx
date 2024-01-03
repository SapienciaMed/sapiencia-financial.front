import React, { useState, forwardRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataView } from "primereact/dataview";
import {
  Paginator,
  PaginatorCurrentPageReportOptions,
  PaginatorNextPageLinkOptions,
  PaginatorPageChangeEvent,
  PaginatorPageLinksOptions,
  PaginatorPrevPageLinkOptions,
  PaginatorRowsPerPageDropdownOptions,
  PaginatorTemplateOptions,
} from "primereact/paginator";
import { classNames } from "primereact/utils";
import * as Icons from "react-icons/fa";
import { useWidth } from "../../../common/hooks/use-width";
import {
  ITableAction,
  ITableElement,
} from "../../../common/interfaces/table.interfaces";
import { Dropdown } from "primereact/dropdown";
import { IPagingData } from "../../../common/utils/api-response";
import { IobjectAddTransfer } from "../../../common/interfaces/global.interface";

interface IProps<T> {
  title?: string;
  secondaryTitle?: string;
  columns: ITableElement<T>[];
  actions?: ITableAction<T>[];
  searchItems?: object;
  isShowModal: boolean;
  titleMessageModalNoResult?: string;
  ownData: IPagingData<IobjectAddTransfer>;
}

interface IRef {
  loadData: (newSearchCriteria?: object) => void;
}

const TableDetailComponent = forwardRef<IRef, IProps<any>>((props, ref) => {
  const { title, secondaryTitle, columns, actions, ownData } = props;

  const [perPage, setPerPage] = useState<number>(10);
  const [first, setFirst] = useState<number>(0);
  const { width } = useWidth();

  // Metodo que alamacena el el estado del paginador
  function onPageChange(event: PaginatorPageChangeEvent): void {
    setPerPage(event.rows);
    setFirst(event.first);
  }

  const mobilTemplate = (item) => {
    return (
      <div className="card-grid-item">
        <div className="card-header">
          {columns.map((column) => {
            const properties = column.fieldName.split(".");
            let field =
              properties.length === 2
                ? item[properties[0]][properties[1]]
                : item[properties[0]];
            return (
              <div key={item} className="item-value-container">
                <p className="text-black bold text-center">{column.header}</p>
                <p> {column.renderCell ? column.renderCell(item) : field} </p>
              </div>
            );
          })}
        </div>
        <div className="card-footer">
          <section className="position-absolute top text-black bold text-center">
            {" "}
            Acciones{" "}
          </section>
          <section className="section-action">
            {actions?.map((action) => (
              <div key={action.icon} onClick={() => action.onClick(item)}>
                {getIconElement(action.icon, "src")}
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="spc-common-table">
      {title && <div className="spc-table-title">{title}</div>}

      <Paginator
        className="between spc-table-paginator"
        template={paginatorHeader}
        first={first}
        rows={perPage}
        totalRecords={ownData?.meta?.total || 0}
        onPageChange={onPageChange}
        leftContent={
          <p className="header-information text-black bold biggest">
            {secondaryTitle ?? "Resultados de búsqueda"}
          </p>
        }
      />

      {width > 830 ? (
        <DataTable
          className="spc-table full-height"
          value={ownData?.array || []}
          scrollable={true}
        >
          {columns.map((col) => (
            <Column
              key={col.fieldName}
              field={col.fieldName}
              header={col.header}
              body={col.renderCell}
            />
          ))}

          {actions && (
            <Column
              className="spc-table-actions"
              header={
                <div>
                  <div className="spc-header-title">Acciones</div>
                </div>
              }
              body={(row) => <ActionComponent row={row} actions={actions} />}
            />
          )}
        </DataTable>
      ) : (
        <DataView
          value={ownData?.array || []}
          itemTemplate={mobilTemplate}
          rows={5}
        />
      )}
      <Paginator
        className="spc-table-paginator"
        template={paginatorFooter}
        first={first}
        rows={perPage}
        totalRecords={ownData?.meta?.total || 0}
        onPageChange={onPageChange}
      />
    </div>
  );
});

// Metodo que retorna el icono o nombre de la accion
function getIconElement(icon: string, element: "name" | "src") {
  switch (icon) {
    case "Detail":
      return element == "name" ? (
        "Detalle"
      ) : (
        <Icons.FaEye className="button grid-button button-detail" title='Visualizar'/>
      );
    case "Edit":
      return element == "name" ? (
        "Editar"
      ) : (
        <Icons.FaPencilAlt className="button grid-button button-edit" title='Editar'/>
      );
    case "Delete":
      return element == "name" ? (
        "Eliminar"
      ) : (
        <Icons.FaTrashAlt className="button grid-button button-delete" title='Eliminar'/>
      );
    case "Link":
      return element == "name" ? (
        "Vincular"
      ) : (
        <Icons.FaLink className="button grid-button button-link" title='Vincular'/>
      );
    default:
      return "";
  }
}

const paginatorHeader: PaginatorTemplateOptions = {
  layout: "CurrentPageReport RowsPerPageDropdown",
  CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
    return (
      <>
        <p className="header-information text-black bold big">
          Total de resultados
        </p>
        <p className="header-information text-three bold big">
          {options.totalRecords}
        </p>
      </>
    );
  },
  RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
    const dropdownOptions = [
      { label: 10, value: 10 },
      { label: 30, value: 30 },
      { label: 50, value: 50 },
      { label: 100, value: 100 },
    ];

    return (
      <React.Fragment>
        <p className="header-information text-black bold big">
          Registros por página{" "}
        </p>
        <Dropdown
          value={options.value}
          className="header-information"
          options={dropdownOptions}
          onChange={options.onChange}
        />
      </React.Fragment>
    );
  },
};

export const paginatorFooter: PaginatorTemplateOptions = {
  layout: "PrevPageLink PageLinks NextPageLink",
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
};

// Metodo que genera el elemento del icono
const ActionComponent = (props: {
  row: any;
  actions: ITableAction<any>[];
}): React.JSX.Element => {
  return (
    <div className="spc-table-action-button">
      {props.actions.map((action) => (
        <div key={action.icon} onClick={() => action.onClick(props.row)}>
          {getIconElement(action.icon, "src")}
        </div>
      ))}
    </div>
  );
};

export default React.memo(TableDetailComponent);
