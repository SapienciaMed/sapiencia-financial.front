import React from 'react'
import { Control, UseFormRegister, useFieldArray } from 'react-hook-form';
import { IBasicTransfers } from '../interfaces/TypesTranfersInterfaces';

interface ICreateSourceFound {
    titleAdd: string,
    controlRegister: Control<IBasicTransfers, any>,
}

function CreateSourceFound() {

    
    return (
        <div className="card-user mt-14px">
            <div className="title-area">
                <label className="text-black biggest"> Traslado origen </label>
            </div>
        </div>
    )
}

export default React.memo(CreateSourceFound);