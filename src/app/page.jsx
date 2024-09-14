"use client";

import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper= () => {
  const cropperRef = useRef(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [image , setImage] = useState(null);

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedDataURL = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
        fillColor: "#fff", 
      }).toDataURL();
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
  }

  const exportImage = () => {
    const backgroundImage = document.getElementById(
      "background-image"
    );
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx || !croppedImage || !backgroundImage) return;

    canvas.width = 614;
    canvas.height = 921;

    ctx.drawImage(backgroundImage, 0, 0, 614, 921);

    
    const croppedImageEl = new Image();
    croppedImageEl.src = croppedImage;
    croppedImageEl.onload = () => {
    
      if (ctx) {
        const size = 198; 
        const x = 352; 
        const y = 512; 
    
        ctx.save(); 
        ctx.beginPath(); 
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
        ctx.clip(); 
    
        ctx.drawImage(croppedImageEl, x, y, size, size); 
    
        ctx.restore();
    
        // Export combined image
        const combinedDataURL = canvas.toDataURL();
        const link = document.createElement("a");
        link.href = combinedDataURL;
        link.download = "download.png";
        link.click();
      }
    }
  };

  return (
    <div className="relative flex w-full justify-center">
      
      <div className="flex flex-col w-1/3 mt-10 justify-start items-center">
          <div className="w-[300px] h-[300px] border border-dashed border-gray-400 overflow-hidden" onClick={ClickImageInput}>
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
          <input id="image-input" className="my-10" type="file" onChange={handleImageChange} />
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
            top: "278px",
            left: "189px",
            width: "108px",
            height: "108px",
            borderRadius: "50%",
          }}
        />
      )}
      </div>
    
    </div>
  );
};

export default ImageCropper;
