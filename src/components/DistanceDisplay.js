import React from "react";

function DistanceDisplay({ distance }) {
  return (
    <div className="distance-display">
      <h2>Distance</h2>
      {distance ? <p>{distance} inches</p> : <p>Click two points to measure.</p>}
    </div>
  );
}

export default DistanceDisplay;
