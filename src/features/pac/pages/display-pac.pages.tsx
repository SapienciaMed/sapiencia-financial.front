import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect, useState } from "react";

function DisplayPacPages() {

    const [ showSpinner, setShowSpinner ] = useState(true)

    useEffect(() => {
        setTimeout(()=> {
            setShowSpinner(false);
        },900)
    },[])

    const rowsMock =[
        {
            title: 'Centro Gestor',
            value: '000000'
        },
        {
            title: 'Pospre',
            value: '000000'
        },
        {
            title: 'Pospre Sapiencia',
            value: '000000'
        },
        {
            title: 'Fondo Sapiencia',
            value: '000000'
        },
        {
            title: 'Fondo',
            value: '000000'  
        },
        {
            title: 'Area Funcional',
            value: '000000'
        },
        {
            title: 'Proyecto',
            value: '000000'
        },
        {
            title: 'Nombre proyecto',
            value: '000000'
        },
        {
            title: 'Presupuesto Sapiencia',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        },
        {
            title: 'Enero Programado',
            value: '000000'
        },
        {
            title: 'Enero Recaudado',
            value: '000000'
        },
        {
            title: 'Enero Ejecutado',
            value: '0000000'
        },
        {
            title: 'Enero Diferencias',
            value: '000000'
        }
        
    ]
    
    return (
        <>
            {
                showSpinner ? 
                    <ProgressSpinner style={{width: '20px', height: '20px'}}  animationDuration=".5s" />
                :
                <table className="details-table">
                    {
                        rowsMock.map(row => {
                            return (
                                <tr key={row.title}>
                                    <th className="th-title text-black weight-500">{row.title}</th>
                                    <th className="th-content text-black weight-500">{row.value}</th>
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