const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

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
        
        if (avatar !== undefined && avatar !== null && Number(avatar) > 0) {
            updateData.avatar = Number(avatar);
            updateData.avatarUrl = null;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No data to update' });
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

        const userId = Number(req.user.id);
        const user = await prisma.user.findUnique({
            where: { id: userId }
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
            where: { id: userId },
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

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = Number(req.user.id);

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, uploadAvatar, changePassword };