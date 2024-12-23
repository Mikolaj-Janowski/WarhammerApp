import React, { useState, useEffect } from "react";

function UnitControls({ addUnit, selectedUnit, updateUnit }) {
  const [unit, setUnit] = useState({
    x: 0,
    y: 0,
    size: 25,
    color: "#007bff",
    shape: "circle",
    image: null,
    name: "",
  });

  useEffect(() => {
    if (selectedUnit) setUnit(selectedUnit);
  }, [selectedUnit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnit({ ...unit, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUnit({ ...unit, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUnit) {
      updateUnit(unit);
    } else {
      addUnit(unit);
    }
    setUnit({ x: 0, y: 0, size: 25, color: "#007bff", shape: "circle", image: null, name: "" });
  };

  return (
    <div className="unit-controls">
      <h2>{selectedUnit ? "Edit Unit" : "Add Unit"}</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={unit.name}
          onChange={handleInputChange}
        />
        <label>X (in inches):</label>
        <input
          type="number"
          name="x"
          value={unit.x}
          onChange={handleInputChange}
        />
        <label>Y (in inches):</label>
        <input
          type="number"
          name="y"
          value={unit.y}
          onChange={handleInputChange}
        />
        <label>Size (in mm):</label>
        <input
          type="number"
          name="size"
          value={unit.size}
          onChange={handleInputChange}
        />
        <label>Shape:</label>
        <select
          name="shape"
          value={unit.shape}
          onChange={handleInputChange}
        >
          <option value="circle">Circle</option>
          <option value="oval">Oval</option>
          <option value="square">Square</option>
        </select>
        <label>Color:</label>
        <input
          type="color"
          name="color"
          value={unit.color}
          onChange={handleInputChange}
        />
        <label>Image:</label>
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <button type="submit">{selectedUnit ? "Update Unit" : "Add Unit"}</button>
      </form>
    </div>
  );
}

export default UnitControls;
