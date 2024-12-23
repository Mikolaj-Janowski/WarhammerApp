import React, { useState } from "react";
import MapCanvas from "./components/MapCanvas";
import UnitControls from "./components/UnitControls";
import DistanceDisplay from "./components/DistanceDisplay";
import "./styles.css";

function App() {
  const [units, setUnits] = useState([]); // Store all unit data
  const [mapImage, setMapImage] = useState(null); // Store uploaded map image
  const [mapDimensions, setMapDimensions] = useState({ width: 48, height: 72 }); // Map dimensions (in inches)
  const [distance, setDistance] = useState(null); // Distance between two points
  const [line, setLine] = useState(null); // Line for measuring distance
  const [selectedUnit, setSelectedUnit] = useState(null); // Track selected unit for editing

  // Add a new unit
  const addUnit = (unit) => setUnits((prevUnits) => [...prevUnits, unit]);

  // Handle unit drag-and-drop
  const updateUnitPosition = (index, newPos) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit, i) => (i === index ? { ...unit, ...newPos } : unit))
    );
  };

  // Handle map image upload
  const handleMapUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setMapImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle map dimension changes
  const handleMapDimensionsChange = (e) => {
    const { name, value } = e.target;
    setMapDimensions((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  // Calculate distance between two points
  const calculateDistance = (point1, point2) => {
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY).toFixed(2);
    setDistance(distance);
  };

  // Handle right-click and drag for distance measurement
  const handleRightClick = (e) => {
    if (e.button === 2) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      setLine({ start: pointerPosition });
    }
  };

  const handleMouseMove = (e) => {
    if (line) {
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      setLine({ ...line, end: pointerPosition });
    }
  };

  const handleRightRelease = () => {
    if (line && line.start && line.end) {
      calculateDistance(
        { x: line.start.x / 25.4, y: line.start.y / 25.4 },
        { x: line.end.x / 25.4, y: line.end.y / 25.4 }
      );
    }
  };

  const handleDoubleClick = () => {
    setLine(null); // Remove the line on double-click
  };

  // Handle unit click for editing
  const handleUnitClick = (unit, index) => {
    setSelectedUnit({ ...unit, index });
  };

  // Update unit data when edited
  const updateUnitData = (updatedUnit) => {
    const { index, ...unitData } = updatedUnit;
    setUnits((prevUnits) =>
      prevUnits.map((unit, i) => (i === index ? unitData : unit))
    );
    setSelectedUnit(null); // Deselect the unit after editing
  };

  return (
    <div className="app-container">
      <h1>Warhammer Age of Sigmar Map Tool</h1>
      <div className="map-menu">
        <h2>Map Settings</h2>
        <input type="file" accept="image/*" onChange={handleMapUpload} />
        <div>
          <label>Map Width (in inches):</label>
          <input
            type="number"
            name="width"
            value={mapDimensions.width}
            onChange={handleMapDimensionsChange}
          />
        </div>
        <div>
          <label>Map Height (in inches):</label>
          <input
            type="number"
            name="height"
            value={mapDimensions.height}
            onChange={handleMapDimensionsChange}
          />
        </div>
      </div>
      <UnitControls
        addUnit={addUnit}
        selectedUnit={selectedUnit}
        updateUnit={updateUnitData}
      />
      <MapCanvas
        mapImage={mapImage}
        units={units}
        updateUnitPosition={updateUnitPosition}
        mapDimensions={mapDimensions}
        line={line}
        handleRightClick={handleRightClick}
        handleMouseMove={handleMouseMove}
        handleRightRelease={handleRightRelease}
        handleDoubleClick={handleDoubleClick}
        onUnitClick={handleUnitClick} // Pass handler to MapCanvas
      />
      <DistanceDisplay distance={distance} />
    </div>
  );
}

export default App;