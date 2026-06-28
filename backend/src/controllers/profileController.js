const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const path = require('path');

const getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.user.id) },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                avatarUrl: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (avatar !== undefined) {
            updateData.avatar = Number(avatar);
            updateData.avatarUrl = null;
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(req.user.id) },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                avatarUrl: true
            }
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(req.user.id) }
        });
        
        if (user.avatarUrl) {
            const oldAvatarPath = path.join(__dirname, '../../', user.avatarUrl);
            try {
                await fs.unlink(oldAvatarPath);
            } catch (err) {
                console.log('Old avatar not found, skipping delete');
            }
        }

        const avatarUrl = `/uploads/${req.file.filename}`;
        
        const updatedUser = await prisma.user.update({
            where: { id: Number(req.user.id) },
            data: { 
                avatarUrl: avatarUrl, 
                avatar: null 
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                avatarUrl: true
            }
        });

        res.status(200).json({
            message: 'Avatar uploaded successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, uploadAvatar };