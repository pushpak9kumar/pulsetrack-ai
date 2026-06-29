const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Workout = require('../models/Workout'); // ✅ Mongoose Workout import kiya

const BADGES = {
    FIRST_STEP: {
        name: 'First Step',
        icon: '👣',
        description: 'Complete your first workout',
        check: async (userId) => {
            try {
                const count = await Workout.countDocuments({ userId: String(userId) });
                return count >= 1;
            } catch (error) {
                console.error('FIRST_STEP check error:', error);
                return false;
            }
        }
    },
    EARLY_BIRD: {
        name: 'Early Bird',
        icon: '🌅',
        description: 'Workout before 6 AM',
        check: async (userId) => {
            try {
                const workouts = await Workout.find({ userId: String(userId) });
                return workouts.some(w => {
                    const workoutDate = w.date || w.createdAt;
                    const hour = new Date(workoutDate).getHours();
                    return hour < 6;
                });
            } catch (error) {
                console.error('EARLY_BIRD check error:', error);
                return false;
            }
        }
    },
    WEEKEND_WARRIOR: {
        name: 'Weekend Warrior',
        icon: '🛡️',
        description: 'Workout on weekend',
        check: async (userId) => {
            try {
                const workouts = await Workout.find({ userId: String(userId) });
                return workouts.some(w => {
                    const workoutDate = w.date || w.createdAt;
                    const day = new Date(workoutDate).getDay();
                    return day === 0 || day === 6;
                });
            } catch (error) {
                console.error('WEEKEND_WARRIOR check error:', error);
                return false;
            }
        }
    },
    CENTURY_CLUB: {
        name: 'Century Club',
        icon: '💯',
        description: 'Complete 100+ minutes',
        check: async (userId) => {
            try {
                const workouts = await Workout.find({ userId: String(userId) });
                const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration), 0);
                return totalMinutes >= 100;
            } catch (error) {
                console.error('CENTURY_CLUB check error:', error);
                return false;
            }
        }
    },
    IRON_WILL: {
        name: 'Iron Will',
        icon: '🔥',
        description: '3 days streak',
        check: async (userId) => {
            try {
                const workouts = await Workout.find({ 
                    userId: String(userId) 
                }).sort({ date: -1 });
                
                if (workouts.length < 3) return false;
                
                const uniqueDays = [...new Set(workouts.map(w => {
                    const workoutDate = w.date || w.createdAt;
                    return new Date(workoutDate).toDateString();
                }))];
                
                if (uniqueDays.length < 3) return false;
                
                const today = new Date();
                let streak = 0;
                
                for (let i = 0; i < 3; i++) {
                    const checkDate = new Date(today);
                    checkDate.setDate(today.getDate() - i);
                    const dateStr = checkDate.toDateString();
                    
                    if (uniqueDays.includes(dateStr)) {
                        streak++;
                    } else {
                        break;
                    }
                }
                
                return streak >= 3;
            } catch (error) {
                console.error('IRON_WILL check error:', error);
                return false;
            }
        }
    },
    MARATHON_MASTER: {
        name: 'Marathon Master',
        icon: '🏃',
        description: '60+ minutes in single workout',
        check: async (userId) => {
            try {
                const workout = await Workout.findOne({
                    userId: String(userId),
                    duration: { $gte: 60 }
                });
                return !!workout;
            } catch (error) {
                console.error('MARATHON_MASTER check error:', error);
                return false;
            }
        }
    }
};

const checkAndUnlockBadges = async (userId) => {
    const unlockedBadges = [];
    
    for (const [badgeType, badge] of Object.entries(BADGES)) {
        try {
            const existing = await prisma.achievement.findUnique({
                where: {
                    userId_badgeType: {
                        userId: Number(userId),
                        badgeType: badgeType
                    }
                }
            });
            
            if (!existing) {
                const earned = await badge.check(userId);
                
                if (earned) {
                    await prisma.achievement.create({
                        data: {
                            userId: Number(userId),
                            badgeType: badgeType
                        }
                    });
                    
                    unlockedBadges.push({
                        type: badgeType,
                        name: badge.name,
                        icon: badge.icon
                    });
                }
            }
        } catch (error) {
            console.error(`Error checking badge ${badgeType}:`, error);
        }
    }
    
    return unlockedBadges;
};

const getAchievements = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        
        const achievements = await prisma.achievement.findMany({
            where: { userId: userId },
            orderBy: { unlockedAt: 'desc' }
        });
        
        const allBadges = Object.entries(BADGES).map(([type, badge]) => {
            const unlocked = achievements.find(a => a.badgeType === type);
            return {
                type,
                name: badge.name,
                icon: badge.icon,
                description: badge.description,
                unlocked: !!unlocked,
                unlockedAt: unlocked?.unlockedAt || null
            };
        });
        
        res.status(200).json(allBadges);
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const checkNewAchievements = async (req, res) => {
    try {
        const userId = Number(req.user.id);
        
        const newBadges = await checkAndUnlockBadges(userId);
        
        res.status(200).json({
            message: newBadges.length > 0 ? 'New badges unlocked!' : 'No new badges',
            badges: newBadges
        });
    } catch (error) {
        console.error('Check achievements error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAchievements, checkNewAchievements, checkAndUnlockBadges };