
export const validateTypePac = (valor: number) => {

    let pacType: string

    if(valor == 2) pacType = 'Programado'

    if(valor == 3) pacType = 'Recaudado'

    if(valor == 4) pacType = 'Ambos'

    return pacType

}