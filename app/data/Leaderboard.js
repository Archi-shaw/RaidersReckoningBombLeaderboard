// export const zone = [
//     {
//         "name": "Team 1",
//         "passed": "Level 4",
//         "teams": ["Level 8", "Level 7", "Level 6", "Level 5", "Level 4", "Level 3", "Level 2", "Level 1"],
//         "status": "active",
//         "endTime": "2025-01-31T10:00:00.000Z"
//     },
//     {
//         "name": "Team 2",
//         "passed": "Level 4",
//         "teams": ["Level 8", "Level 7", "Level 6", "Level 5", "Level 4", "Level 3", "Level 2", "Level 1"],
//         "status": "active",
//         "endTime": "2025-01-31T10:00:00.000Z"
//     },
//     {
//         "name": "Team 3",
//         "passed": "Level 4",
//         "teams": ["Level 8", "Level 7", "Level 6", "Level 5", "Level 4", "Level 3", "Level 2", "Level 1"],
//         "status": "active",
//         "endTime": "2025-01-31T10:00:00.000Z"
//     },
//     {
//         "name": "Team 4",
//         "passed": "Level 4",
//         "teams": ["Level 8", "Level 7", "Level 6", "Level 5", "Level 4", "Level 3", "Level 2", "Level 1"],
//         "status": "active",
//         "endTime": "2025-01-31T10:00:00.000Z"
//     }
// ]
//
// export const zonesData = zone

export const translateDataToZones = (data) => {
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.bomb_id]) {
            acc[item.bomb_id] = [];
        }
        acc[item.bomb_id].push(item);
        return acc;
    }, {});

    return Object.keys(groupedData).map((bomb_id) => {
        const bombData = groupedData[bomb_id];
        const levels = Array.from({ length: 8 }, (_, i) => i + 1);
        const endTime = levels.map(level => {
            const levelData = bombData.find(item => item.level === level);
            return levelData ? { level: level, time: levelData.time } : { level: level, time: null };
        });

        return {
            name: `Bomb ${bomb_id}`,
            passed: `Level ${Math.max(...bombData.map(item => item.level))}`,
            teams: ["Level 8", "Level 7", "Level 6", "Level 5", "Level 4", "Level 3", "Level 2", "Level 1"],
            status: "active",
            endTime: endTime
        };
    });
};