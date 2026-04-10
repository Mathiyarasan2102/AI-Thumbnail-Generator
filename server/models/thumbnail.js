import mongoose from "mongoose";

const ThumbnailSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    style: { type: String, enum: ["Bold & Graphic", "Tech/Futuristic", "Minimalistic", "Photorealistic", "Illustrated"] },
    aspect_ratio: { type: String, enum: ["16:9", "1:1", "9:16"], default: '16:9 ' },
    color_scheme: { type: String, enum: ["Vibrant", "Sunset", "Forest", "Neon", "Purple", "Monochrome", "Ocean", "Pastel"] },
    text_overlay: { type: Boolean, default: false },
    image_url: { type: String, default: '' },
    prompt_used: { type: String },
    user_prompt: { type: String },
    isGenerating: { type: Boolean, default: true },
}, { timestamps: true });

const Thumbnail = mongoose.models.Thumbnail || mongoose.model('Thumbnail', ThumbnailSchema)

export default Thumbnail;
