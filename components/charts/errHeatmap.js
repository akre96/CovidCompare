import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FaInfoCircle } from 'react-icons/fa';
import Popover from 'react-bootstrap/Popover';
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
      if (typeof model_order[d.model_short] === 'undefined') return;
      out[model_order[d.model_short]][d.errwk - 1] = d.value;
    }
  });
  return out;
}
function ErrHeatmap({ data, region }) {
  let xLabels = [];
  for (let i = 1; i <= 12; i++) {
    xLabels.push(i);
  }

  // create matrix for heatmap
  const transformedData = transformDataHeatmap(data, region);

  // Filter out if model has no prediction data
  const filteredData = transformedData.filter((d) => !(d.join(',').replace(/,/g, '').length === 0));
  const filteredModels = models.filter(
    (_d, i) => !(transformedData[i].join(',').replace(/,/g, '').length === 0),
  );
  const filteredLabels = filteredModels.map((m) => m.name.replace(/-/g, '_'));
  const yLabelsStyle = (i) => ({
    color: filteredModels[i].color,
    fontWeight: 'bold',
    whitespace: 'nowrap',
  });
  return (
    <div className="px-4 hmap">
      <strong>Forecast week</strong>
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={
                <Popover>
                  <Popover.Title as="h3">Forecast Week</Popover.Title>
                  <Popover.Content>
                  This heatmap shows predictive validity for each model, over weeks of extrapolation.
                  </Popover.Content>
                </Popover>
              }
            >
              <FaInfoCircle fontSize={'1rem'} style={{ marginTop: '-15px', marginLeft: '5px' }} />
            </OverlayTrigger>
      <HeatMapGrid
        data={filteredData}
        cellHeight="3rem"
        cellStyle={(_x, _y, ratio) => {
          if (ratio === null) {
            return {
              background: `rgb(255, 255, 255, 1)`,
            };
          }
          return {
            background: `rgb(194, 54, 22, ${ratio})`,
            fontSize: '.8rem',
            color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
          };
        }}
        cellRender={(x, y, value) => <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>}
        square
        xLabels={xLabels}
        yLabels={filteredLabels}
        yLabelsStyle={yLabelsStyle}
      />
    </div>
  );
}
ErrHeatmap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  region: PropTypes.string,
};

export default ErrHeatmap;
