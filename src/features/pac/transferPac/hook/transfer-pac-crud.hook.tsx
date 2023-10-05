import React from "react";
import { useForm } from 'react-hook-form';

export function useTransferPacCrudData() {

    const {
        formState: { errors, isValid },
        control
    } = useForm();

    return{
        control,
        errors
    }
    
}

