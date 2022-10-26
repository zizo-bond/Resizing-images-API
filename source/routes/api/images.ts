import express from 'express';
import path from './../../file';
import fs from 'fs';
import { resizeImage, resizedImagePath } from '../../utils/imageTransforms';
import { promises as fsPromises } from 'fs';
/* define images*/
const images = express.Router();

images.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const filename = req.query.filename as unknown as string;
    const height = parseInt(req.query.height as unknown as string);
    const width = parseInt(req.query.width as unknown as string);
    const outputPath: string = resizedImagePath(filename, height, width);
    
      /* Check if requested file is available*/
    if (!fs.existsSync(outputPath)) {
      const resizedImage = await resizeImage(filename, height, width);
      await fsPromises.writeFile(outputPath, resizedImage);
    }
    res.sendFile(path.resolve(outputPath));
  } catch (err) {
    res.render('errors', { message: err.message });
  }
});

export default images;
