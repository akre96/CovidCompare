import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import PropTypes from 'prop-types';

const model_order = {
  Delphi: 0,
  IHME_MS_SEIR: 1,
  LANL: 2,
  Imperial: 3,
  SIKJalpha: 4,
};

function transformDataHeatmap(data, region) {
  var out = Array(5).fill(null);
  for (let i = 0; i < 5; i++) {
    out[i] = Array(12).fill(null);
  }
  data.map((d) => {
    if (d.super_region === region) {
      out[model_order[d.model_short]][d.errwk - 1] = d.value;
    }
  });
  return out;
}
function ErrHeatmap({ data, region }) {
  const yLabels = ['Delphi', 'IHME_MS_SEIR', 'LANL', 'Imperial', 'SIKJalpha'];
  let xLabels = [];
  for (let i = 1; i <= 12; i++) {
    xLabels.push(i);
  }
  const transformedData = transformDataHeatmap(data, region);

  return (
    <div className="hmap">
      <strong>Forecast week</strong>
      <HeatMapGrid
        data={transformedData}
        cellHeight="3rem"
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(194, 54, 22, ${ratio})`,
          fontSize: '.8rem',
          color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
        })}
        cellRender={(x, y, value) => <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>}
        square
        xLabels={xLabels}
        yLabels={yLabels}
      />
    </div>
  );
}
ErrHeatmap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  region: PropTypes.string,
};

export default ErrHeatmap;
