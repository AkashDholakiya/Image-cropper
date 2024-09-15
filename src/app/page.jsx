"use client";

import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = () => {
  const cropperRef = useRef(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState(""); // State for the name

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedDataURL = cropper
        .getCroppedCanvas({
          width: 200,
          height: 200,
          fillColor: "#fff",
        })
        .toDataURL();
      setCroppedImage(croppedDataURL);
    }
  };

  const ClickImageInput = () => {
    const imageInput = document.getElementById("image-input");
    if (imageInput && !image) {
      imageInput.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportImage = () => {
    const backgroundImage = document.getElementById("background-image");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx || !croppedImage || !backgroundImage) return;

    canvas.width = 614;
    canvas.height = 921;

    // Draw the background image
    ctx.drawImage(backgroundImage, 0, 0, 614, 921);

    // Draw the cropped image inside a circle
    const croppedImageEl = new Image();
    croppedImageEl.src = croppedImage;
    croppedImageEl.onload = () => {
      const size = 186;
      const x = 352;
      const y = 544;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(croppedImageEl, x, y, size, size);
      ctx.restore();

      // Add the user's name
      if (name) {
        ctx.font = "bold 28px Arial"; // Font style
        ctx.fillStyle = "#fff"; // Text color
        ctx.textAlign = "left";
        const nameX = 130;
        const nameY = 715;
        ctx.fillText(name,nameX, nameY, 800); // Position the text
      }

      // Export combined image
      const combinedDataURL = canvas.toDataURL();
      const link = document.createElement("a");
      link.href = combinedDataURL;
      link.download = "download.png";
      link.click();
    };
  };

  return (
    <div className="relative flex w-full justify-center">
      <div className="flex flex-col w-1/3 mt-10 justify-start items-center">
        <div
          className="w-[300px] h-[300px] border border-dashed border-gray-400 overflow-hidden"
          onClick={ClickImageInput}
        >
          <Cropper
            src={image} // Image to be cropped
            style={{ height: "100%", width: "100%" }}
            aspectRatio={1} // Circle crop
            guides={false}
            crop={onCrop}
            ref={cropperRef}
            viewMode={1}
            background={false}
            responsive={true}
            autoCropArea={1}
          />
        </div>
        <input
          id="image-input"
          className="mt-5"
          type="file"
          onChange={handleImageChange}
        />
        {/* name */}
        <div className="flex flex-col my-5 items-start">
          <label htmlFor="name" className="mb-1">
            Enter Your Name : {"{In English}"}
          </label>
          <input
            type="text"
            name="name"
            className="w-[300px] p-2 border border-gray-400 rounded-lg"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Handle name input
          />
        </div>
        {/* email */}
        <button
          onClick={exportImage}
          className="bottom-5 left-5 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Save
        </button>
      </div>

      <div className="relative mt-10 max-lg:hidden">
        <img
          id="background-image"
          src="/main-sample.jpg"
          alt="Background"
          className="w-full h-[500px]"
        />
        {croppedImage && (
          <img
            src={croppedImage}
            alt="Cropped"
            style={{
              position: "absolute",
              top: "295px",
              left: "181px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ImageCropper;
