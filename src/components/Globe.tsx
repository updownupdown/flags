import { JSX, useEffect, useState } from "react";
import { mapShapes as country } from "../map/map-shapes";
import { svgPathBbox } from "svg-path-bbox";
import "./Globe.scss";

const goalProportionPercentage = 0.38;
const mapScaling = 0.4;

const windowSize = {
  x: 120,
  y: 120,
};

const svgSize = {
  x: 2000,
  y: 1000,
};

const mapSize = {
  width: svgSize.x * mapScaling,
  height: svgSize.y * mapScaling,
};

interface Props {
  selectedCountry: string;
}

export const Globe = ({ selectedCountry }: Props) => {
  const [style, setStyle] = useState({});
  const [map, setMap] = useState<JSX.Element | undefined>(undefined);

  useEffect(() => {
    const countryEntry = country.find(
      (country) => country.id === selectedCountry
    );

    if (!countryEntry) return;

    const box = svgPathBbox(countryEntry.shape);

    const centerTop = ((box[1] + box[3]) / 2) * mapScaling;
    const centerLeft = ((box[0] + box[2]) / 2) * mapScaling;

    const offsetTop = mapSize.height / 2 - centerTop;
    const offsetLeft = mapSize.width / 2 - centerLeft;

    const transformOriginTop = (centerTop / mapSize.height) * 100;
    const transformOriginLeft = (centerLeft / mapSize.width) * 100;

    const percentageOfHeight = ((box[3] - box[1]) / windowSize.y) * mapScaling;
    const percentageOfWidth = ((box[2] - box[0]) / windowSize.x) * mapScaling;

    const largestPercentage = Math.max(percentageOfHeight, percentageOfWidth);

    const scaleLevel = goalProportionPercentage / largestPercentage;

    setStyle({
      top: offsetTop + "px",
      left: offsetLeft + "px",
      transformOrigin: `${transformOriginLeft}% ${transformOriginTop}%`,
      transform: `scale(${scaleLevel})`,
    });

    setMap(
      <>
        {country.map((country) => {
          // Always draw non-selected countries first, for z-index
          if (selectedCountry === country.id) return;

          return (
            <path
              key={country.id}
              id={country.id}
              d={country.shape}
              style={{
                fill: "var(--K300)",
                stroke: "var(--K500)",
                strokeWidth: 2 / scaleLevel,
              }}
            />
          );
        })}
        {country.map((country) => {
          // Always draw selected countries last, for z-index
          if (selectedCountry !== country.id) return;

          return (
            <path
              key={country.id}
              id={country.id}
              d={country.shape}
              style={{
                fill: "var(--accent)",
                stroke: "var(--accent-hover)",
                strokeWidth: 3 / scaleLevel,
              }}
            />
          );
        })}
      </>
    );
  }, [selectedCountry]);

  return (
    <div
      className="globe-wrap"
      style={{
        width: windowSize.x + "px",
        height: windowSize.y + "px",
      }}
    >
      <div
        className="globe"
        style={{
          width: mapSize.width + "px",
          height: mapSize.height + "px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={mapSize.width}
          height={mapSize.height}
          viewBox={`0 0 ${svgSize.x} ${svgSize.y}`}
          style={style}
        >
          {map}
        </svg>
      </div>
    </div>
  );
};
