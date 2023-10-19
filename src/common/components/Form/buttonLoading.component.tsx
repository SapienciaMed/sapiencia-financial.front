import { Button } from "primereact/button";
import React, { SyntheticEvent, useEffect, useState } from "react";

interface ILabelProps {
  value: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  action?: Function;
  id?: string;
  form?: string;
  disabled?: boolean;
  isLoading?:boolean;
}

export function ButtonLoadingComponent({
  value,
  type = "submit",
  className = "button-main",
  action = () => { },
  id,
  form,
  disabled,
  isLoading
}: ILabelProps): React.JSX.Element {


  const [loading, setLoading] = useState(isLoading);
  const handleButtonClick = (event: SyntheticEvent) => {
    if (type !== "submit") event.preventDefault();
    action();
  };

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])
  

  return (
    <div className="card flex flex-wrap justify-content-center gap-3">
      <Button
        style={{borderRadius:'20px', border:'none'}}
        type={type}
        id={id}
        form={form}
        label={value}
        className={className}
        icon="pi pi-check"
        loading={loading}
        onClick={handleButtonClick}
        disabled={disabled}/>
    </div>


  );
}


{/* <Button
      type={type}
      id={id}
      form={form}
      className={className}
      onClick={handleButtonClick}
      disabled={disabled}
      //onClick={load}
      loading={loading}
    >
      {value}
    </Button> */}