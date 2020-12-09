/**
 * @file Team page of site showcases team members
 * @author Samir Akre <sakre@g.ucla.edu>
 */
import React from 'react';
import Image from 'react-bootstrap/Image';
import { BsBoxArrowUpRight } from 'react-icons/bs';

import TeamMembers from '../assets/team_members.json';

function TeamMember({ info }) {
  const linkData = info.links.map((l) => (
    <a href={l.url} target="_blank" rel="noreferrer">
      <BsBoxArrowUpRight style={{ marginLeft: '5px' }} />
      {' '}
      {l.name}
      {' '}
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

export default function TeamPage() {
  const members = TeamMembers.map((m) => <TeamMember info={m} />);
  return (
    <>
      <h2>The Team</h2>
      <div className="row justify-content-center">{members}</div>
    </>
  );
}
