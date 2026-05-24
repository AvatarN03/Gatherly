import multer from "multer";
import { toFile } from "@imagekit/nodejs";
import imagekit from "../utils/imagekit.ts";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/index.ts";

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadToImageKit = (folder: string) => 
  async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) return next();

      const existingFileId = req.body.imageFileId
       if (existingFileId) {
        try {
          await imagekit.files.delete(folder + "/"  + existingFileId)
          console.log('Old image deleted:', existingFileId)
        } catch (deleteError) {
          // log but continue — old file might already be gone
          console.warn('Could not delete old image:', deleteError)
        }
      }

      const uploadResponse = await imagekit.files.upload({
        file: await toFile(req.file.buffer, req.file.originalname),
        fileName: req.file.originalname,
        folder,  // dynamic folder
      });

      req.imageUrl = uploadResponse.url;
      req.imageFileId = uploadResponse.fileId;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Image upload failed: ' + (error instanceof Error ? error.message : String(error)) });
    }
  };