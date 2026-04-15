import express from 'express'
import Thumbnail from '../models/thumbnail.js';

// Controllers to get ALL User Thumbnails
export const getUsersThumbnails = async (req, res) => {

    try {
        const { userId } = req.session;

        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 })
        res.json({ thumbnails })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

//controllers to get single thumbnail of a User 

export const getThumbnailbyId = async (req, res) => {
    try {
        const { userId } = req.session;

        const { id } = req.params;

        const thumbnail = await Thumbnail.findOne({ userId, _id: id })
        res.json({ thumbnail })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}