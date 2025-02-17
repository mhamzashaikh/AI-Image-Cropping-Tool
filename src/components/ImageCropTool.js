"use client";
import { cropImage, getAutoCroppedImg } from "@/utils/cropImage";
import Image from "next/image";
import { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropTool() {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const onCropComplete = async (_, croppedAreaPixels) => {
    const cropImgURL = await cropImage(croppedImage, croppedAreaPixels);
    setCroppedImageUrl(cropImgURL);
  };

  const handleImageUpload = (e) => {
    if (croppedImage !== null) setCroppedImage(null);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // auto crop [ AI based ]
  const handleAutoCrop = async () => {
    if (!image) return;
    const croppedImg = await getAutoCroppedImg(image);

    setCroppedImage(croppedImg);
  };

  const handleDownload = () => {
    if (croppedImageUrl) {
      const link = document.createElement("a");
      link.href = croppedImageUrl;
      link.download = "cropped-image.png";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {image && !croppedImage && (
        <div className=" w-full h-full flex justify-center">
          <Image
            className="aspect-video"
            alt="imageUploaded"
            src={image}
            width={600}
            height={260}
          />
        </div>
      )}
      {image && !croppedImage && (
        <button
          onClick={handleAutoCrop}
          className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
        >
          Auto Crop Image
        </button>
      )}

      {croppedImage && (
        <>
          <div className="relative w-full h-[50vh] ">
            <Cropper
              image={croppedImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <button
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
            onClick={handleDownload}
          >
            Download crop image
          </button>
        </>
      )}
    </div>
  );
}

export default ImageCropTool;
