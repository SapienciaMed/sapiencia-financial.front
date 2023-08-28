import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import AreaCreateAddition from "../../forms/area-create-addition";
import AreaCreateExpense from "../../forms/area-create-expense";
import { Control, useFormState, UseFormGetValues, UseFormWatch, UseFormRegister } from "react-hook-form";
import { IAdditionsForm } from "../../managementCenter/interfaces/Additions";
import { IArrayDataSelect, IMessage } from "../../../common/interfaces/global.interface";

interface IAppProps {
  controlRegister: Control<IAdditionsForm, any>;
  arrayDataSelect: IArrayDataSelect,
  register: UseFormRegister<IAdditionsForm>,
  showModal: (values: IMessage) => void;
  watch:  UseFormWatch<IAdditionsForm>,
  onSubmitTab: (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  getValues: UseFormGetValues<IAdditionsForm>;
}

function TabManagerAdditionPage({
  controlRegister,
  arrayDataSelect,
  register,
  showModal,
  getValues,
  onSubmitTab,
  watch,
}: IAppProps) {
  const { option } = useParams();
  const navigate = useNavigate();

  const { dirtyFields, isValid, errors } = useFormState({
    control: controlRegister,
  });

  const tabs: ITabsMenuTemplate[] = [
    {
      id: "ingreso",
      title: "Ingreso",
      content: (
        <AreaCreateAddition
          titleAdd="ingreso"
          controlRegister={controlRegister}
          showModal={showModal}
          getValues={getValues}
          arrayDataSelect={arrayDataSelect}
          register={register}
        />
      ),
      action: () => {},
    },
    {
      id: "gasto",
      title: "Gasto",
      content: (
        <AreaCreateExpense
          titleAdd="gasto"
          controlRegister={controlRegister}
          showModal={showModal}
          getValues={getValues}
          arrayDataSelect={arrayDataSelect}
          register={register}
        />
      ),
      action: () => {},
    },
  ];

  const start = tabs.find(
    (tab) => tab.id.toString().toLowerCase() === option?.toLowerCase()
  );
  const [selectedTab, setSelectedTab] = useState<ITabsMenuTemplate>( start ? start : null );

  const tabList = {};
  tabs.forEach(
    (tab) =>
      (tabList[`${tab.title}`] = {
        content: tab.content,
        action: tab.action,
      })
  );

  const handleTabClick = (tab: ITabsMenuTemplate) => {
    setSelectedTab(tab);
    // watch();
    // onSubmitTab();
    // errors?.ingreso?.message == "datos duplicados en el sistema" &&
    //   showModal({
    //     title: "Validación de datos",
    //     description: errors?.ingreso?.message,
    //     show: true,
    //     OkTitle: "Aceptar",
    //   });

    // if (dirtyFields?.ingreso?.length > 0 && isValid) {
    //   setSelectedTab(tab);
    // }
  };

  useEffect(() => {
    if (!selectedTab)
      if (tabs.length !== 0) {
        setSelectedTab(tabs[0]);
      }
  }, [tabs]);

  useEffect(() => {
    if (selectedTab) if (selectedTab.action) selectedTab.action();
  }, [selectedTab]);

  return (
    <div className="pt-24px">
      <div className="tabs-component">
        <div className="tabs-selection">
          {tabs.map((tab) => {
            let active = "";
            if (selectedTab) if (selectedTab.id === tab.id) active = "active";
            return (
              <div
                className={`tab-option ${active}`}
                key={tab.id}
                onClick={() => {
                  handleTabClick(tab);
                }}
              >
                {tab.title}
              </div>
            );
          })}
        </div>
        <div className="tabs-content">
          {selectedTab ? tabList[`${selectedTab?.title}`].content : "no data"}
        </div>
      </div>
    </div>
  );
}

export default React.memo(TabManagerAdditionPage);
