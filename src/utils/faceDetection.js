import * as faceapi from "face-api.js";

export const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
};

export const detectFace = async (imageSrc) => {
  const img = await faceapi.fetchImage(imageSrc);
  const detections = await faceapi.detectSingleFace(
    img,
    new faceapi.TinyFaceDetectorOptions()
  );

  return detections;
};
