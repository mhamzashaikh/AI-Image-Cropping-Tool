import { detectFace, loadModels } from "./faceDetection";

// Auto Cropped Image [ AI based: used face api js library]
export const getAutoCroppedImg = async (imageSrc) => {
  await loadModels();
  let croppedAreaPixels; // if the cropAreaPixels receive from props you've to detect face within that given cropped area
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const detections = await detectFace(imageSrc);
  if (detections) {
    const { x, y, width, height } = detections.box;
    croppedAreaPixels = { x, y, width, height };
  } else {
    croppedAreaPixels = {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    };
  }

  const padding = 100; // Adjust the padding value as needed

  // Apply padding to the cropping area
  const paddedAreaPixels = {
    x: Math.max(croppedAreaPixels.x - padding, 0), // Prevent going outside the image
    y: Math.max(croppedAreaPixels.y - padding, 0), // Prevent going outside the image
    width: croppedAreaPixels.width + padding * 2, // Add padding to the width
    height: croppedAreaPixels.height + padding * 2, // Add padding to the height
  };

  // Ensure the padded area doesn't go outside the image boundaries
  paddedAreaPixels.width = Math.min(
    paddedAreaPixels.width,
    image.width - paddedAreaPixels.x
  );
  paddedAreaPixels.height = Math.min(
    paddedAreaPixels.height,
    image.height - paddedAreaPixels.y
  );

  canvas.width = paddedAreaPixels.width;
  canvas.height = paddedAreaPixels.height;

  ctx.drawImage(
    image,
    paddedAreaPixels.x,
    paddedAreaPixels.y,
    paddedAreaPixels.width,
    paddedAreaPixels.height,
    0,
    0,
    paddedAreaPixels.width,
    paddedAreaPixels.height
  );

  return canvas.toDataURL("image/jpeg");
};

// Manual Crop Image
export const cropImage = async (imageSrc, cropAreaPixels) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = cropAreaPixels.width;
  canvas.height = cropAreaPixels.height;

  ctx.drawImage(
    image,
    cropAreaPixels.x,
    cropAreaPixels.y,
    cropAreaPixels.width,
    cropAreaPixels.height,
    0,
    0,
    cropAreaPixels.width,
    cropAreaPixels.height
  );

  return canvas.toDataURL("image/jpeg");
};

// helper func
const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });
};
