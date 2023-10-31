import React, { useState, useEffect, useRef } from 'react';

const SelectSearch = ({ options, setter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [selectedOption, setSelectedOption] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    const node = useRef(null);

    const handleSearchChange = (e) => {
        const input = e.target.value;
        setSearchTerm(input);
        if (input === '') {
            setFilteredOptions(options);
            setShowOptions(true);
        } else {
            filterOptions(input);
            setShowOptions(true);
        }
    };

    const filterOptions = (input) => {
        const filtered = options.filter(
            (option) =>
                option.name.toLowerCase().includes(input.toLowerCase()) ||
                option.value.toString().toLowerCase().includes(input.toLowerCase())
        );
        setFilteredOptions(filtered);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option.name);
        setSearchTerm(option.name);
        setShowOptions(false);
        setter(option.value);
    };

    const handleClick = (e) => {
        if (node.current && node.current.contains(e.target)) {
            return;
        }
        setShowOptions(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    return (
        <div className="position-relative" ref={node}>
            <input
                className="form-control"
                type="text"
                placeholder="Seleccione..."
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setShowOptions(true)}
            />
            {showOptions && (
                <div
                    className="position-absolute mt-1"
                    style={{ zIndex: 1, width: '100%', maxHeight: '200px', overflowY: 'auto', backgroundColor: 'white' }}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleOptionSelect(option)}
                                style={{
                                    cursor: 'pointer',
                                    borderTop: index !== 0 ? '1px solid #dee2e6' : 'none',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                }}
                            >
                                {option.name}
                            </div>
                        ))
                    ) : (
                        options.map((option, index) => (
                            <div
                                key={option.value}
                                onClick={() => handleOptionSelect(option)}
                                style={{
                                    cursor: 'pointer',
                                    borderTop: index !== 0 ? '1px solid #dee2e6' : 'none',
                                    textDecoration: 'none',
                                    padding: '8px 16px',
                                }}
                            >
                                {option.name}
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
};

export default SelectSearch;
