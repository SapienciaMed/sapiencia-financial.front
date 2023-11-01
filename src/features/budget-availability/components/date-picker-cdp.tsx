import React, { useState } from 'react';

const DatePickerCdp = ({ setYear, setMonth, setDate, selected, placeholder, disabled, id = "" }) => {
    const [value, setValue] = useState(selected || null);

    const mothsYear = [
        "meses",
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ];

    /* const handleChange = (e) => {
        const selectedDate = e.target.value;
        const parts = selectedDate.split('-');
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        setDate(selectedDate);
        setValue(formattedDate);
        
        let partsDate = selectedDate.split("-");
        setYear(partsDate[0]);
        let monthNumber = parseInt(partsDate[1]);
        setMonth(mothsYear[monthNumber]);
    }; */


    const handleChange = (newValue) => {
        let dateSelected = event.target['value'];
        const arrData = dateSelected.split("-");
        
        setYear(arrData[0]);
        setMonth(mothsYear[parseInt(arrData[1])]);
        setDate(dateSelected);
        if (newValue instanceof Date) {
                 setValue(newValue);
        } 
        
    };
    
    
    return (
        <input 
            type="date" 
            value={value} 
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            id={id}
            className='general-input'
        />
    );
};

export default DatePickerCdp;
