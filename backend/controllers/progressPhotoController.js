import { prisma } from "../utils/helpers.js";
import { generateUploadURL } from "../utils/s3.js";

export const getProgressPhotos = async (req, res) => {
  try {
    const userId = req.userId;
    const photos = await prisma.progressPhoto.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: "Error fetching progress photos" });
  }
};

export const getUploadUrl = async (req, res) => {
  try {
    const userId = req.userId;
    const filename = `${userId}-${Date.now()}.jpg`;
    const url = await generateUploadURL(filename);
    res.json({ url, filename });
  } catch (error) {
    res.status(500).json({ error: "Error generating upload URL" });
  }
};

export const savePhotoDetails = async (req, res) => {
  try {
    const { filename } = req.body;
    const userId = req.userId;
    const photo = await prisma.progressPhoto.create({
      data: {
        userId,
        imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`,
      },
    });
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: "Error saving photo details" });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    await prisma.progressPhoto.deleteMany({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting photo" });
  }
};
