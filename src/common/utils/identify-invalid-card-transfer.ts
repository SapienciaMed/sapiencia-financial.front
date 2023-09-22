import { Dispatch, SetStateAction } from "react";


export const identifyInvalidcardTransfers = (additionMove: any, message: string, setInvalidCardsAdditionSt: Dispatch<SetStateAction<any[]>>) => {
    let messageSplit = message.split('@@@')
    let cardValidation = [];
    let invalidCard;

    if(messageSplit[1] && JSON.parse(messageSplit[3])?.length > 0){
      JSON.parse(messageSplit[3]).forEach(code => {
        invalidCard = additionMove.find(addition => addition?.idCard?.includes(code));
        cardValidation.push(invalidCard)
        setInvalidCardsAdditionSt(cardValidation)
      })
      return 
    }

    if (messageSplit[3] && JSON.parse(messageSplit[3])?.length > 0) {
      JSON.parse(messageSplit[9]).forEach(code => {
        invalidCard = additionMove?.find(addition => addition?.idCard?.includes(code))
        cardValidation.push(invalidCard)
      })

      setInvalidCardsAdditionSt(cardValidation)
      return 
    } else if (messageSplit[6] && JSON.parse(messageSplit[6])?.length > 0) {
      JSON.parse(messageSplit[6]).forEach(code => {
        invalidCard = additionMove?.find(addition => addition?.idCard?.includes(code))
        cardValidation.push(invalidCard)
        setInvalidCardsAdditionSt(cardValidation)
      })
      return
    } else if (messageSplit[9] && JSON.parse(messageSplit[9])?.length > 0) {
      JSON.parse(messageSplit[9]).forEach(code => {
        invalidCard = additionMove.find(addition => addition?.idCard?.includes(code))
        cardValidation.push(invalidCard)
        setInvalidCardsAdditionSt(cardValidation)
      })
      return
    }
  }