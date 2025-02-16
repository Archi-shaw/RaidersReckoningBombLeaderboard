// Function to format time from seconds to MM:SS
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const TeamDetails = ({ zone, details, index }) => {
    return (
        <div className="team-details">
            <span>{formatTime(zone[index].time)}</span>
        </div>
    );
};

export default TeamDetails;