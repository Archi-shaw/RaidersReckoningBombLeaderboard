import React from 'react';

const TeamDetails = ({ team, details }) => {
  return (
    <div className="team-details">
      <span>{details.minutes}</span><span> : </span>
      <span>{details.seconds}</span>
    </div>
  );
};

export default TeamDetails;