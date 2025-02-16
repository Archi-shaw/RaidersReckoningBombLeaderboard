export const translateDataToZones = (data) => {
    // Filter data to only include objects with the required properties
    const filteredData = data.filter(item =>
        item.hasOwnProperty('bomb_id') &&
        item.hasOwnProperty('level') &&
        item.hasOwnProperty('time') &&
        item.hasOwnProperty('ip')
    );
    // console.log(data);
    // Group the filtered data by bomb_id
    const groupedData = filteredData.reduce((acc, item) => {
        if (!acc[item.bomb_id]) {
            acc[item.bomb_id] = [];
        }
        acc[item.bomb_id].push(item);
        return acc;
    }, {});

    // Map the grouped data to the desired format
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
            endTime: endTime,
            ip: bombData[bombData.length-1].ip // Assuming all entries for the same bomb_id have the same ip
        };
    });
};