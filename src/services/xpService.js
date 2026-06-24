//function for XP calculation
const calculateXP = ( duration, calorieBurned ) => {
    const baseXP = duration * 10;
    const bonusXP = (calorieBurned || 0) * 0.5; // if calorie not given then 0
    const totalXP = Math.floor(baseXP + bonusXP);

    return totalXP;
};

//function for level calculation
const calculateLevel = (totalXP) => {
    let level = 1;
    let xpNeeded = 1000;
    let curentLevelXP = 0;

    while(totalXP >= xpNeeded) {
        level++;
        currentLevelXP = xpNeeded;
        xpNeeded += level * 1000;
    }

    return {
        level,
        currentLevelXP : xpNeeded,
        xpToNextLevel: xpNeeded - totalXP
    };
};

module.exports = { calculateXP, calculateLevel };