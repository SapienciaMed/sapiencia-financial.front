import { useContext, useRef } from "react"
import { IRouteBudget } from "../interfaces/paysInterfaces"
import { AppContext } from "../../../common/contexts/app.context"


export function ValidateRouteAnInitialBudget() {

    const { authorization } = useContext(AppContext);

    const dataRoutesToInsertStRef = useRef<IRouteBudget[]>([]);
    const dataRoutesToInsertStFixedRef = useRef<IRouteBudget[]>([]);
    const projectCodeSearchInStrategicRef = useRef<string[]>([]);

    const checkBudgetRouteDoesNotExist = async (
        dataBudgetRoutesCreatedSt: any,
        getAllFundsListSt: any,
        getAllPospre: any,
        getAllPospreSapienciaListSt: any,
        infoErrors: any[],
        row: number,
        CentroGestor: string,
        PospreOrigen: string,
        PospreSapiencia: string,
        AreaFuncional: string,
        Fondo: string,
        proyecto: string,
        ValorInicial: string
    ) => {
        console.log({row})
        if(row==1){
            infoErrors=[]    
        }
        // estructuración de datos de proyecto para consultar en planeación
        projectCodeSearchInStrategicRef.current = [
            ...projectCodeSearchInStrategicRef.current,
            proyecto
        ]

        let PospreOrigenFoundObj = getAllPospre.find(e => e.number == PospreOrigen)

        // reporta pospre origen que no existe
        !PospreOrigenFoundObj && verifyBudgetPositionExists(infoErrors, row)

        let pospreSapienciaFoundObj = getAllPospreSapienciaListSt.find(e => e.number == PospreSapiencia)

        // registra el pospre sapiensa que no existe
        !pospreSapienciaFoundObj && verifyExistPospreSapienceForExcercise(infoErrors, row)

        //let pospreSapienciaFound = dataBudgetRoutesCreatedSt.find(e => e.idPospreSapiencia == pospreSapienciaFoundObj?.pospreSapiencia.id)
        let fundFoundObj = getAllFundsListSt.find(e => e.number == Fondo)

        // registra el fondo que no existe
        !fundFoundObj && verifyFundExist(infoErrors, row)

        dataRoutesToInsertStRef.current = [
            ...dataRoutesToInsertStRef.current,
            {
                row,
                codeProyectStrategic: proyecto,
                idProjectVinculation: null,
                managementCenter: CentroGestor,
                div: 'SAPI',
                idBudget: PospreOrigenFoundObj?.id,
                idPospreSapiencia: pospreSapienciaFoundObj?.id,
                idFund: fundFoundObj?.id,
                balance: parseFloat(ValorInicial),
                initialBalance: parseFloat(ValorInicial),
                userCreate: authorization.user?.numberDocument
            },
        ];
    }

    const verifyBudgetPositionExists = async (infoErrors: any[], row: number) => {
        infoErrors.push({
            rowError: row,
            message: 'No existe la pospre origen en el presupuesto',
        })
    }

    const verifyExistPospreSapienceForExcercise = async (infoErrors: any[], row: number) => {
        infoErrors.push({
            rowError: row,
            message: 'No existe la pospre sapiencia en el presupuesto',
        })
    }

    const verifyFundExist = async (infoErrors: any[], row: number) => {
        infoErrors.push({
            rowError: row,
            message: 'No existe el fondo en el presupuesto',
        })
    }

    const checkValueBudgetWithProjectPlanning = async (proyectsPlanning: any[], dataRoutesToInsertArr: IRouteBudget[], proyectsVinculation: number[], dataBudgetRoutesCreatedSt: any[] ) => {
        return await validateInitialBalance(dataRoutesToInsertArr, proyectsPlanning, proyectsVinculation,dataBudgetRoutesCreatedSt)
    }

    
    const validateInitialBalance = async (arrayToInsert, proyectos, proyectsVinculation,dataBudgetRoutesCreatedSt) => {
        console.log("Vamos aveeer",dataBudgetRoutesCreatedSt);


        let infoErrors: Array<{ rowError: number, message: string }> = []
        for await (const objToInsert of arrayToInsert) {

            const proyecto = proyectos.find((p) => p.bpin == objToInsert.codeProyectStrategic);
            if (proyecto) {
                if (
                    objToInsert.managementCenter &&
                    objToInsert.idBudget &&
                    objToInsert.idFund &&
                    objToInsert.idPospreSapiencia
                ) {
                    infoErrors.push({
                        rowError: objToInsert.row,
                        message: 'La ruta ya existe',
                    })
                } else {
                    dataRoutesToInsertStFixedRef.current = [
                        ...dataRoutesToInsertStFixedRef.current,
                        {
                            idProjectVinculation: proyectsVinculation.find(e => e.investmentProjectId == proyecto.id).id,
                            managementCenter: objToInsert.managementCenter,
                            div: 'SAPI',
                            idBudget: objToInsert.idBudget,
                            idPospreSapiencia: objToInsert.idPospreSapiencia,
                            idFund: objToInsert.idFund,
                            balance: objToInsert.balance,
                            initialBalance: objToInsert.initialBalance,
                            userCreate: objToInsert.userCreate
                        },
                    ];


                    const totalAmountUnitCost = await proyecto.activities.reduce(async (total, activity) => {
                        const detail = await activity.detailActivities.find((detail) => detail.pospre === objToInsert.idBudget);
                        if (detail) {
                            return total + parseInt(detail.amount) * parseFloat(detail.unitCost);
                        }
                        return total;
                    }, 0);

                    if (totalAmountUnitCost !== objToInsert.initialBalance) {
                        infoErrors.push({
                            rowError: objToInsert.row,
                            message: `El valor inicial del proyecto y pospre no coincide con planeación`
                        })
                    }
                }
            } else {
                infoErrors.push({
                    rowError: objToInsert.row,
                    message: 'No existe en planeación'
                })
            }
        }
        return infoErrors
    }

    return {
        checkBudgetRouteDoesNotExist,
        checkValueBudgetWithProjectPlanning,
        projectCodeSearchInStrategicRef,
        dataRoutesToInsertStRef,
        dataRoutesToInsertStFixedRef
    }
}