import React from "react";
import useReports from "../../hooks/useReports";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
} from "../../../../common/components/Form";
import { Controller } from "react-hook-form";
import { EDirection } from "../../../../common/constants/input.enum";
import { typesReports } from "../../constants";

const HomeReports = () => {
  const {
    onSubmit,
    control,
    register,
    errors,
    isBtnDisable,
    setMessage,
    navigate,
    selectedReport,
  } = useReports();

  return (
    <div>
      <FormComponent action={onSubmit}>
        <div className="one-filter-container">
          <Controller
            control={control}
            name={"exercise"}
            defaultValue={String(new Date().getFullYear())}
            render={({ field }) => {
              return (
                <InputComponent
                  id={field.name}
                  idInput={field.name}
                  className="input-basic color-default-value"
                  typeInput="number"
                  register={register}
                  label="Vigencia"
                  classNameLabel="text-black weight-500 biggest text-required"
                  direction={EDirection.column}
                  onChange={field.onChange}
                  errors={errors}
                />
              );
            }}
          />
        </div>
        <div className="two-filters-container">
          {typesReports?.map((report, index) => (
            <div key={report.name}>
              <Controller
                control={control}
                name={report.name}
                render={({ field }) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        lineHeight: "18.77px",
                      }}
                    >
                      <div>
                        <input
                          id={field.name}
                          onChange={field.onChange}
                          type="radio"
                          style={{ width: "18px", height: "18px" }}
                          checked={selectedReport === report.name}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "16px",
                            fontWeight: 400,
                            fontFamily: "Work Sans",
                            color: "#3E3E3E",
                          }}
                        >
                          {report.title}
                        </label>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          ))}
        </div>
        <div className="funcionality-buttons-container">
          <ButtonComponent
            form="useQueryForm"
            value="Cancelar"
            type="button"
            className="button-clean-fields bold"
            action={() => {
              setMessage({
                title: "Cancelar",
                show: true,
                cancelTitle: "Cancelar",
                OkTitle: "Aceptar",
                description: (
                  <div style={{ width: "100%" }}>
                    <label>¿Estas segur@ de cancelar?</label>
                  </div>
                ),
                background: true,
                onOk: () => {
                  navigate("/gestion-financiera/reports");
                  setMessage({});
                },
                onCancel: () => {
                  setMessage({});
                },
              });
            }}
          />
          <ButtonComponent
            className="button-main huge hover-three"
            value="Generar"
            type="submit"
            disabled={!isBtnDisable}
          />
        </div>
      </FormComponent>
    </div>
  );
};

export default HomeReports;
