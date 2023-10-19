
export const validateTypePac = (valor: number) => {

    let pacType: string

    if(valor == 2) pacType = 'Programado'

    if(valor == 3) pacType = 'Recaudado'

    if(valor == 4) pacType = 'Ambos'

    return pacType

}

export const validateTypePacservice = (valor: string) => {

    let pacType: string

    if(valor == 'Programado') pacType = ''

    if(valor == 'Recaudado') pacType = ''

    if(valor == 'Ambos') pacType = ''

    return pacType

}