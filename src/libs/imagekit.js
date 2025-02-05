import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadImage = async (file) => {
  try {
    const response = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
    return response.url;
  } catch (error) {
    throw new Error("Image upload failed");
  }
};
