import { ProgressSpinner } from "primereact/progressspinner";
import React, { useContext, useEffect, useState } from "react";
import { usePacServices } from "../hook/pac-services.hook";
import { AppContext } from "../../../common/contexts/app.context";
import { EResponseCodes } from "../../../common/constants/api.enum";

type dataCondensedServiceProp = {
    title: string,
    value: string 
}

function DisplayPacPages() {

    const [ showSpinner, setShowSpinner ] = useState(true)
    const [ dataCondensedService, setDataCondensedService ] = useState<dataCondensedServiceProp[]>()
    const { condensedQueryData } = useContext(AppContext);
    const { ViewPacComplete } = usePacServices()

    useEffect(() => {
        ViewPacComplete(condensedQueryData).then(response => {
            setShowSpinner(false)
            if (response.operation.code === EResponseCodes.OK) {
                const dinamicData = response?.data;

                const months = [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
                    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
                ];

                const monthsServices = [
                    "Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul",
                    "Ago", "Sep", "Oct", "Nov", "Dec",
                ];

                const propServices = [ 'totalProgramming', 'totalCollected', 'execute', 'diference' ]

                const titleAnnual = [ 'programado', 'recaudado', 'ejecutado', 'diferencias' ]

                const additionalData = [
                    {
                        title: 'Centro Gestor',
                        value: dinamicData?.managementCenter
                    },
                    {
                        title: 'Pospre',
                        value: `${condensedQueryData?.dataCondensed?.posPreOrig}`
                    },
                    {
                        title: 'Pospre Sapiencia',
                        value: dinamicData?.posPreSapiNumber
                    },
                    {
                        title: 'Fondo',
                        value: dinamicData?.fundNumber
                    },
                    {
                        title: 'Area Funcional',
                        value: dinamicData?.functionalAreaNumber
                    },
                    {
                        title: 'Proyecto',
                        value: dinamicData?.projectCode
                    },
                    {
                        title: 'Nombre proyecto',
                        value: dinamicData?.projectName
                    },
                    {
                        title: 'Presupuesto Sapiencia',
                        value: `$ ${dinamicData?.totalProgrammingAnnual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
                    },
                    
                ];

                const annualCollectionData  = [
                    {
                        title: 'Recaudado',
                        value: `$ ${dinamicData?.totalCollectedAnnual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
                    },
                    {
                        title: 'Por Recaudar',
                        value: `$ ${dinamicData?.forCollected.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
                    },
                    {
                        title: 'Por Porcentaje Ejecución',
                        value: `${dinamicData?.percentExecuteAnnual}`
                    }
                ]

                const monthsData = monthsServices.map((month, index) => {
                    const data = propServices.map((prop, index2) => {
                        return {
                            title: `${months[index]} ${titleAnnual[index2]}`,
                            value: `$ ${dinamicData?.[month]?.[`${prop}${month}`].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
                        }
                    })
                    return data
                })

                const data = additionalData.concat(monthsData.flat()).concat(annualCollectionData)

                setDataCondensedService(data)

            }else {
                console.log(response.operation.message)
            }
        }).catch((error) => {
            setShowSpinner(false)
            console.log(error);
        })
    },[condensedQueryData])

    return (
        <>
            {
                showSpinner ? 
                    <ProgressSpinner style={{width: '20px', height: '20px'}}  animationDuration=".5s" />
                :
                <table className="details-table detail-table-scroll">
                    {
                        dataCondensedService?.map(data => {
                            return (
                                <tr key={data.title}>
                                    <th className="th-title text-black weight-500">{data.title}</th>
                                    <th className="th-content text-black weight-500">{data.value}</th>
                                </tr>
                            )
                        })
                    }
                </table>   
            }
        </>
    )
}

export default React.memo(DisplayPacPages);