/**
 * @file Team page of site showcases team members
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React from 'react';
import Image from 'react-bootstrap/Image';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import PropTypes from 'prop-types';

import TeamMembers from '../assets/team_members.json';

function TeamMember({ info }) {
  const linkData = info.links.map((l) => (
    <a href={l.url} key={l.name} target="_blank" rel="noreferrer">
      <BsBoxArrowUpRight style={{ marginLeft: '5px' }} /> {l.name}{' '}
    </a>
  ));
  return (
    <div className="row  justify-content-center teamMember">
      <div className="col-md-3 col-10 justify-content-center">
        <Image className="mx-auto d-block" src={info.picture} height="190px" roundedCircle />
      </div>
      <div className="col-md-9 col-10">
        <h3>{info.name}</h3>
        <p>{info.bio}</p>
        <p>{linkData}</p>
      </div>
    </div>
  );
}
TeamMember.propTypes = {
  info: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    picture: PropTypes.string,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.String,
        url: PropTypes.String,
      }),
    ),
  }).isRequired,
};

export default function TeamPage() {
  const members = TeamMembers.map((m) => <TeamMember key={m.name} info={m} />);
  return (
    <>
      <h2>The Team</h2>
      <div className="row justify-content-center">{members}</div>
    </>
  );
}
