import React, { useEffect, useState, useRef } from "react";

const SelectSearch = ({ options, setter, style, defaultValue }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(defaultValue || "");
  const [showOptions, setShowOptions] = useState(false);

  const node = useRef(null);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    if (input === "") {
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
    console.log(option);
  };

  const handleClick = (e) => {
    if (node.current && node.current.contains(e.target)) {
      if (e.target.tagName === "DIV") {
        // handleOptionSelect({ name: e.target.innerText });
        return;
      }
      return;
    }
    setShowOptions(false);
  };

  const handleInputClick = () => {
    setShowOptions(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    options.forEach((element) => {
      if (element.value === defaultValue) {
        setSearchTerm(element.name || "");
        setSelectedOption(element.name || "");
      }
    });
  }, [defaultValue, options]);

  return (
    <div className="position-relative" ref={node}>
      <input
        className="form-control"
        type="text"
        placeholder="Seleccione..."
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={handleInputClick}
        onFocus={handleInputClick}
        style={style}
      />
      {showOptions && (
        <div
          className="position-absolute mt-1"
          style={{
            zIndex: 1,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "white",
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleOptionSelect(option)}
                className={`${
                  option.name === selectedOption ? "selected-option" : ""
                }`}
                style={{
                  cursor: "pointer",
                  borderTop: index !== 0 ? "1px solid #dee2e6" : "none",
                  textDecoration: "none",
                  padding: "8px 16px",
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
                className={`${
                  option.name === selectedOption ? "selected-option" : ""
                }`}
                style={{
                  cursor: "pointer",
                  borderTop: index !== 0 ? "1px solid #dee2e6" : "none",
                  textDecoration: "none",
                  padding: "8px 16px",
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
