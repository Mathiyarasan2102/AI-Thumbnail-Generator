import express from 'express';
import { deleteThumbnail, generateThumbnail } from '../controllers/thumbnailController';

const ThumbnailRouter = express.Router();

ThumbnailRouter.post('/generate', generateThumbnail)
ThumbnailRouter.delete('/delete/:id', deleteThumbnail)

export default ThumbnailRouter;