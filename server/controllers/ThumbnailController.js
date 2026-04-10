import { req, res, response } from 'express'
import Thumbnail from '../models/thumbnail';

export const generateThumbnail = async (req, res) => {
    try {
        const { userId } = req.session;


        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;


        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true
        })

        const model = 'gemini-3-pro-image-preview'

        const generationConfig = {
            maxOutputTokens: 32768,
            temperature: 1,
            topP: 0.95,
            responseModalities: ['IMAGE']
        }
    } catch (error) {

    }
}