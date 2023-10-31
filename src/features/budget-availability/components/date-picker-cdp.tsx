import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
const DatePickerCdp = ({ selected, onChange, placeholder, disabled,id="" }) => {
    const [startDate, setStartDate] = useState(selected || new Date());

    const handleChange = date => {
        setStartDate(date);
        onChange(date);
    };

    return ( <>akive</>
        // <DatePicker
        //     selected={startDate}
        //     onChange={handleChange}
        //     dateFormat="dd/MM/yyyy"
        //     placeholderText={placeholder}
        //     disabled={disabled}
        //     className='general-input'
        //     id={id}
        // />
    );
};

export default DatePickerCdp;
