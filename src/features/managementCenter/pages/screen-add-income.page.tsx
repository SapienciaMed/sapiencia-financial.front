import React, { useEffect, useState } from "react";
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
} from "../../../common/components/Form";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { IAdditionsForm } from "../interfaces/Additions";
import {
  IArrayDataSelect,
  IDropdownPropsFuctionalArea,
} from "../../../common/interfaces/global.interface";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { useWatch } from "react-hook-form";
import { ICreateSourceForm } from "../transfer/interfaces/TransferAreaCrudInterface";

interface IAppProps {
  controlRegister: Control<IAdditionsForm, any>;
  titleAdd: "ingreso" | "gasto";
  arrayDataSelect: IArrayDataSelect;
  count: number;
  errors: FieldErrors<IAdditionsForm>;
  fields: any;
  remove: (index?: number | number[]) => void;
  register: UseFormRegister<IAdditionsForm>;
  cardId: string;
  invalidCardsAdditionSt: any;
  setValue: any;
  watch: any;
  detail?: boolean;
}

function ScreenAddIncome({
  count,
  controlRegister,
  errors,
  fields,
  arrayDataSelect,
  remove,
  titleAdd,
  register,
  cardId,
  invalidCardsAdditionSt,
  setValue,
  watch,
  detail,
}: IAppProps) {
  const { functionalArea, areas, funds, posPre } = arrayDataSelect;

  const formOrigen = useWatch({ control: controlRegister, name: titleAdd });

  const [projectIdSelectedSt, setProjectIdSelectedSt] = useState<string>("");
  const [areaIdSelectedSt, setAreaIdSelectedSt] = useState<number | string>();
  const [areasByProjectSt, setAreasByProjectSt] =
    useState<IDropdownPropsFuctionalArea[]>(functionalArea);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    if (projectName != "") {
      setValue(`${titleAdd.toLowerCase()}[${count}].cardId`, cardId);
      setValue(
        `${titleAdd.toLowerCase()}[${count}].functionalArea`,
        areasByProjectSt.find((e) => e.value != null).id ?? areaIdSelectedSt
      );
      setValue(`${titleAdd.toLowerCase()}[${count}].projectName`, projectName);
    }
  }, [projectIdSelectedSt]);

  useEffect(() => {
    processFunctionalArea(formOrigen[count].projectId);
  }, [projectName]);

  const optionSelected = (option: any) => {
    if (option) {
      setProjectName(
        functionalArea.find((e) => e.value == option)?.description
      );
      processFunctionalArea(option);
    }
  };

  const processFunctionalArea = (option: any) => {
    const areaList: IDropdownPropsFuctionalArea[] = functionalArea
      .filter((props) => props.value != null)
      .map((propsFunctionalArea) => {
        Object(propsFunctionalArea).area[0]["projectId"] =
          propsFunctionalArea?.id;
        return Object(propsFunctionalArea).area;
      });

    const area = areaList
      .flat()
      .filter(
        (propsAreaList) =>
          propsAreaList.projectId == option && propsAreaList.value !== null
      );

    setProjectIdSelectedSt(option);
    setAreaIdSelectedSt(area[0]?.id);
    setAreasByProjectSt(area);
  };

  let invalidStyleCard = {
    background: invalidCardsAdditionSt?.find(
      (e) => e?.idCard == watch(`${titleAdd.toLowerCase()}[${count}].cardId`)
    )
      ? "rgba(255, 0, 0, 0.30)"
      : "none",
    border: invalidCardsAdditionSt?.find(
      (e) => e?.idCard == watch(`${titleAdd.toLowerCase()}[${count}].cardId`)
    )
      ? "1px solid #F00"
      : "",
  };
  return (
    <>
      <div className="card-user mt-14px" style={invalidStyleCard}>
        <div className="title-area">
          <label className="text-black biggest">
            {" "}
            {count + 1}. {titleAdd.charAt(0).toUpperCase() + titleAdd.slice(1)}
          </label>
          {!detail && (
            <ButtonComponent
              value={"Eliminar"}
              type="button"
              action={() => {
                remove(count);
              }}
              className="button-delete biggest bold"
            />
          )}
        </div>
        <div>
          <section className="grid-form-2-container-reverse mt-5px">
            <SelectComponent
              idInput={`${titleAdd.toLowerCase()}[${count}].managerCenter`}
              control={controlRegister}
              label={"Centro gestor"}
              className="select-basic medium"
              classNameLabel="text-black big bold text-required"
              placeholder={"Seleccionar"}
              data={[{ id: "91500000", name: "91500000", value: "91500000" }]}
              filter={true}
              fieldArray={true}
              errors={errors}
              disabled={detail}
            />
            <SelectComponent
              idInput={`${titleAdd.toLowerCase()}[${count}].projectId`}
              control={controlRegister}
              label={"Proyecto"}
              className="select-basic medium"
              classNameLabel="text-black big bold text-required"
              placeholder={"Seleccionar"}
              data={functionalArea}
              filter={true}
              fieldArray={true}
              errors={errors}
              optionSelected={optionSelected}
              disabled={detail}
            />
            <SelectComponent
              idInput={`${titleAdd.toLowerCase()}[${count}].functionalArea`}
              control={controlRegister}
              label={"Área funcional"}
              className="select-basic medium"
              classNameLabel="text-black big bold text-required"
              placeholder={"Seleccionar"}
              filter={true}
              fieldArray={true}
              data={areasByProjectSt}
              errors={errors}
              disabled={detail}
            />
          </section>
          <section className="grid-form-3-container-area mt-5px">
            <SelectComponent
              idInput={`${titleAdd.toLowerCase()}[${count}].funds`}
              control={controlRegister}
              label={"Fondo"}
              className="select-basic medium"
              classNameLabel="text-black big bold text-required"
              placeholder={"Seleccionar"}
              filter={true}
              fieldArray={true}
              data={funds}
              errors={errors}
              disabled={detail}
            />
            <SelectComponent
              idInput={`${titleAdd.toLowerCase()}[${count}].posPre`}
              control={controlRegister}
              label={"Pospre"}
              className="select-basic medium"
              classNameLabel="text-black big bold text-required"
              placeholder={"Seleccionar"}
              filter={true}
              fieldArray={true}
              data={posPre}
              errors={errors}
              disabled={detail}
            />

            <InputNumberComponent
              control={controlRegister}
              idInput={`${titleAdd.toLowerCase()}[${count}].value`}
              label="valor"
              className="inputNumber-basic medium"
              placeholder={"Seleccionar"}
              classNameLabel="text-black biggest bold text-required"
              errors={errors}
              mode="currency"
              currency="COP"
              locale="es-CO"
              fieldArray={true}
              minFractionDigits={0}
              maxFractionDigits={0}
              disabled={detail}
            />
          </section>
          <section className="grid-form-1-container-area mt-5px">
            <InputComponent
              idInput={`${titleAdd.toLowerCase()}[${count}].projectName`}
              label="Nombre proyecto"
              typeInput="text"
              className="input-basic large"
              placeholder={"Seleccionar"}
              classNameLabel="text-black biggest bold text-required"
              errors={errors}
              register={register}
              fieldArray={true}
              disabled={true}
            />
          </section>
        </div>
      </div>
    </>
  );
}

export default React.memo(ScreenAddIncome);
