/**
 * @file Table to view update date of models
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React from 'react';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { BsBoxArrowRight } from 'react-icons/bs';

import fetcher from '../lib/fetcher';

import models from '../assets/models';

// Table rows for model showing model date
export default function ModelDateTable() {
  const { data } = useSWR('/api/forecast/model_dates', fetcher);
  const ModelInfo = models
    // get active models
    .filter((m) => m.current)
    // Return model date if in data
    .map((m) => {
      if (data) {
        const modelDate = data.data.filter((m2) => m2.model_short === m.name);
        if (modelDate.length > 0) {
          return {
            ...m,
            model_date: dayjs(modelDate[0].model_date).format('MMM DD YYYY'),
          };
        }
      }
      return {
        ...m,
        model_date: '...loading',
      };
    })
    // Map models to table elements
    .map((m) => (
      <tr key={m.name}>
        <td style={{ color: m.color }}>
          {m.name}
          <a href={m.link} rel="noreferrer" target="_blank">
            <BsBoxArrowRight style={{ marginLeft: '5px' }} />
          </a>
        </td>
        <td>{m.model_date}</td>
      </tr>
    ));

  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th>Model Group</th>
          <th>Predictions Last Updated</th>
        </tr>
      </thead>
      <tbody>{ModelInfo}</tbody>
    </table>
  );
}
