import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Circle, Ellipse, Text, Group, Image as KonvaImage, Line } from "react-konva";

const MapCanvas = ({
  mapImage,
  units,
  updateUnitPosition,
  mapDimensions,
  onUnitClick,
  line,
  handleRightClick,
  handleMouseMove,
  handleRightRelease,
  handleDoubleClick,
}) => {
  const scale = 25.4; // Conversion from inches to mm

  const [loadedMapImage, setLoadedMapImage] = useState(null);
  const [unitImages, setUnitImages] = useState([]); // Store loaded images for units

  // Load map image
  useEffect(() => {
    if (mapImage) {
      const img = new window.Image();
      img.src = mapImage;
      img.onload = () => setLoadedMapImage(img);
    }
  }, [mapImage]);

  // Load unit images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(
        units.map((unit) => {
          if (unit.image) {
            const img = new window.Image();
            img.src = unit.image;
            return new Promise((resolve) => {
              img.onload = () => resolve(img);
            });
          }
          return null;
        })
      );
      setUnitImages(loadedImages);
    };
    loadImages();
  }, [units]);

  const renderUnitShape = (unit, index) => {
    const { shape, size, color, name } = unit;
    const unitImage = unitImages[index]; // Corresponding loaded image for the unit
  
    const unitProps = {
      x: unit.x * scale,
      y: unit.y * scale,
      draggable: true,
      onDragEnd: (e) => {
        const x = e.target.x() / scale;
        const y = e.target.y() / scale;
        updateUnitPosition(index, { x, y });
      },
      onClick: () => onUnitClick(unit, index), // Handle unit click
    };
  
    return (
      <Group key={index} {...unitProps}>
        {/* Background color shape */}
        {shape === "circle" && (
          <Circle x={0} y={0} radius={size / 2} fill={color} />
        )}
        {shape === "oval" && (
          <Ellipse x={0} y={0} radiusX={size / 2} radiusY={size / 4} fill={color} />
        )}
        {shape === "square" && (
          <Rect
            x={-size / 2}
            y={-size / 2}
            width={size}
            height={size}
            fill={color}
          />
        )}
  
        {/* Render image clipped to the shape */}
        {unitImage && (
          <KonvaImage
            x={-size / 2}
            y={-size / 2}
            width={size}
            height={size}
            image={unitImage}
            sceneFunc={(ctx, shapeObj) => {
              // Clip the image to the selected shape
              if (shape === "circle") {
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.clip();
              } else if (shape === "oval") {
                ctx.beginPath();
                ctx.ellipse(size / 2, size / 2, size / 2, size / 4, 0, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
              } else if (shape === "square") {
                ctx.beginPath();
                ctx.rect(0, 0, size, size);
                ctx.closePath();
                ctx.clip();
              }
  
              // Draw the image inside the clipped area
              ctx.drawImage(unitImage, 0, 0, size, size);
            }}
          />
        )}
  
        {/* Unit label */}
        <Text
          x={-size / 2}
          y={-size / 2 - 20} // Position label above the shape
          text={name}
          fontSize={14}
          fill="black"
          align="center"
          width={size}
        />
      </Group>
    );
  };

  return (
    <Stage
      width={mapDimensions.width * scale}
      height={mapDimensions.height * scale}
      onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
      onMouseDown={handleRightClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleRightRelease}
      onDblClick={handleDoubleClick}
    >
      <Layer>
        {loadedMapImage && (
          <KonvaImage
            x={0}
            y={0}
            image={loadedMapImage}
            width={mapDimensions.width * scale}
            height={mapDimensions.height * scale}
          />
        )}
      </Layer>
      <Layer>
        {units.map((unit, index) => renderUnitShape(unit, index))}
      </Layer>
      <Layer>
        {line?.start && line?.end && (
          <Line
            points={[
              line.start.x,
              line.start.y,
              line.end.x,
              line.end.y,
            ]}
            stroke="red"
            strokeWidth={2}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default MapCanvas;