import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Build a Cloudinary delivery URL with sensible defaults (auto format/quality).
export function cldUrl(publicId: string, opts: string = 'f_auto,q_auto,c_fill') {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/${opts}/${publicId}`;
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
