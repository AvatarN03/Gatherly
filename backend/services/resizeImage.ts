import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

const MAX_MEGAPIXELS = 20_000_000; // stay safely under ImageKit's 25MP ceiling
const MAX_DIMENSION = 4000; // fallback cap per side

export const resizeImageIfNeeded = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) return next();

    const metadata = await sharp(req.file.buffer).metadata();
    const { width = 0, height = 0 } = metadata;
    const megapixels = width * height;

    if (megapixels > MAX_MEGAPIXELS || width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const resizedBuffer = await sharp(req.file.buffer)
        .resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: "inside", // preserves aspect ratio, only shrinks, never upscales
          withoutEnlargement: true,
        })
        .toBuffer();

      req.file.buffer = resizedBuffer;
      req.file.size = resizedBuffer.length;

      console.log(
        `Resized image from ${width}x${height} to fit within ${MAX_DIMENSION}px`
      );
    }

    next();
  } catch (error) {
    res.status(500).json({
      error:
        "Image processing failed: " +
        (error instanceof Error ? error.message : String(error)),
    });
  }
};