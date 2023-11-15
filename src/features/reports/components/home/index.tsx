import useReports from "../../hooks/useReports";
import {
  ButtonComponent,
  FormComponent,
  InputComponent,
} from "../../../../common/components/Form";
import { Controller } from "react-hook-form";
import { EDirection } from "../../../../common/constants/input.enum";
import { typesReports } from "../../constants";
import { useWidth } from "../../../../common/hooks/use-width";

const HomeReports = () => {
  const { width } = useWidth();
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
      <FormComponent action={onSubmit} id="form-report">
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
        <div
          className={
            width > 540
              ? "two-filters-container"
              : "funcionality-filters-container"
          }
        >
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
                  navigate("/gestion-financiera");
                  setMessage({});
                },
                onCancel: () => {
                  setMessage({});
                },
              });
            }}
          />
          <ButtonComponent
            value="Generar"
            type="submit"
            form="form-report"
            className="button-main huge hover-three"
            disabled={!isBtnDisable}
          />
        </div>
      </FormComponent>
    </div>
  );
};

export default HomeReports;
