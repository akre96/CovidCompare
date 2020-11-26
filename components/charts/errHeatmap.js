import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import PropTypes from 'prop-types';
import models from '../../assets/models';

let model_order = {};
models.map((m, i) => {
  model_order[m.name] = i;
});

function transformDataHeatmap(data, region) {
  var out = Array(models.length).fill(null);
  for (let i = 0; i < models.length; i++) {
    out[i] = Array(12).fill(null);
  }
  data.map((d) => {
    if (d.super_region === region) {
      if (!model_order[d.model_short]) return;
      out[model_order[d.model_short]][d.errwk - 1] = d.value;
    }
  });
  return out;
}
function ErrHeatmap({ data, region }) {
  const yLabels = models.map((m) => m.name);
  let xLabels = [];
  for (let i = 1; i <= 12; i++) {
    xLabels.push(i);
  }

  // create matrix for heatmap
  const transformedData = transformDataHeatmap(data, region);

  // Filter out if model has no prediction data
  const filteredData = transformedData.filter((d) => !(d.join(',').replace(/,/g, '').length === 0));
  const filteredLabels = yLabels.filter(
    (_d, i) => !(transformedData[i].join(',').replace(/,/g, '').length === 0),
  );
  return (
    <div className="px-4 hmap">
      <strong>Forecast week</strong>
      <HeatMapGrid
        data={filteredData}
        cellHeight="3rem"
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(194, 54, 22, ${ratio})`,
          fontSize: '.8rem',
          color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
        })}
        cellRender={(x, y, value) => <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>}
        square
        xLabels={xLabels}
        yLabels={filteredLabels}
      />
    </div>
  );
}
ErrHeatmap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  region: PropTypes.string,
};

export default ErrHeatmap;
