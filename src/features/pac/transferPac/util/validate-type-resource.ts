
export const validateTypeResource = (valor: string) => {

    let sourceType: string

    if(valor == 'Distrital') sourceType = 'Transferencias distritales'

    if(valor == 'Propio') sourceType = 'Recursos propios'

    return sourceType

}

export const validateTypeResourceServices = (valor: string) => {

    let sourceType: string

    if(valor == 'Transferencias distritales') sourceType = 'Distrital'

    if(valor == 'Recursos propios') sourceType = 'Propio'

    return sourceType

}