import { useContext, useRef } from "react"
import { IRouteBudget } from "../interfaces/paysInterfaces"
import { AppContext } from "../../../common/contexts/app.context"


export function ValidateRouteAnInitialBudget() {

    const { authorization } = useContext(AppContext);

    const dataRoutesToInsertStRef = useRef<IRouteBudget[]>([]);
    const dataRoutesToInsertStFixedRef = useRef<IRouteBudget[]>([]);
    const projectCodeSearchInStrategicRef = useRef<string[]>([]);

    const checkBudgetRouteDoesNotExist = async (
        dataBudgetRoutesCreatedSt,
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

        // estructuración de datos de proyecto para consultar en planeación
        projectCodeSearchInStrategicRef.current = [
            ...projectCodeSearchInStrategicRef.current,
            proyecto
        ]

        let manageCenterFound = dataBudgetRoutesCreatedSt.find(e => e.managementCenter == CentroGestor)
        //console.log({manageCenterFound, dataBudgetRoutesCreatedSt})
        let PospreOrigenFoundObj = dataBudgetRoutesCreatedSt.find(e => e.budget.number == PospreOrigen)

        // reporta pospre origen que no existe
        !PospreOrigenFoundObj && verifyBudgetPositionExists(infoErrors, row)

        let PospreOrigenFound = dataBudgetRoutesCreatedSt.find(e => e.idBudget == PospreOrigenFoundObj?.budget.id)

        let pospreSapienciaFoundObj = dataBudgetRoutesCreatedSt.find(e => e.pospreSapiencia.number == PospreSapiencia)

        // registra el pospre sapiensa que no existe
        !pospreSapienciaFoundObj && verifyExistPospreSapienceForExcercise(infoErrors, row)

        let pospreSapienciaFound = dataBudgetRoutesCreatedSt.find(e => e.idPospreSapiencia == pospreSapienciaFoundObj?.pospreSapiencia.id)
        let fundFoundObj = dataBudgetRoutesCreatedSt.find(e => e.fund.number == Fondo)

        // registra el fondo que no existe
        !fundFoundObj && verifyFundExist(infoErrors, row)

        let fundFound = dataBudgetRoutesCreatedSt.find(e => e.idFund == fundFoundObj?.fund.id)

        // registra la ruta presupuesta que no existe
        /* if (
            !manageCenterFound &&
            PospreOrigenFound &&
            pospreSapienciaFound &&
            fundFound
        ) {
            infoErrors.push({
                rowError: row,
                message: 'La ruta ya existe',
            })
        } else { */
        dataRoutesToInsertStRef.current = [
            ...dataRoutesToInsertStRef.current,
            {
                row,
                codeProyectStrategic: proyecto,
                idProjectVinculation: null,
                managementCenter: CentroGestor,
                div: 'SAPI',
                idBudget: PospreOrigenFoundObj?.budget.id,
                idPospreSapiencia: pospreSapienciaFoundObj?.pospreSapiencia.id,
                idFund: fundFoundObj?.fund.id,
                balance: parseFloat(ValorInicial),
                initialBalance: parseFloat(ValorInicial),
                userCreate: authorization.user?.numberDocument
            },
        ];
        /*  } */
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

    const checkValueBudgetWithProjectPlanning = async (proyectsPlanning: any[], dataRoutesToInsertArr: IRouteBudget[], proyectsVinculation: number[]) => {
        return await validateInitialBalance(dataRoutesToInsertArr, proyectsPlanning, proyectsVinculation)
    }

    const validateInitialBalance = async (arrayToInsert, proyectos, proyectsVinculation) => {


        let infoErrors: Array<{ rowError: number, message: string }> = []
        for await (const objToInsert of arrayToInsert) {

            const proyecto = proyectos.find((p) => p.bpin == objToInsert.codeProyectStrategic);
            console.log({ proyecto, row: objToInsert.row, insert: objToInsert })
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