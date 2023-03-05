import { useEffect, useRef, useState } from 'react';
import FrameLeft from './frame-left.png';
import FrameMiddle from './frame-middle.png';
import FrameRight from './frame-right.png';

const createUnsafeImage = (src) => {
  const image = new Image();
  image.src = src;
  image.setAttribute('crossorigin', 'anonymous');

  return image;
}

function Canvas(props) {
  const canvasRef = useRef();
  const [frameLeft, setFrameLeft] = useState(null);
  const [frameMiddle, setFrameMiddle] = useState(null);
  const [frameRight, setFrameRight] = useState(null);
  const [image, setImage] = useState(null);

  const {
    backgroundSrc,
    backgroundWidth,
    backgroundHeight,
    startX,
    startY,
    framePartWidth,
    framePartHeight,
    imageSrc,
  } = props;

  useEffect(() => {
    if (canvasRef?.current) {
      const background = createUnsafeImage(backgroundSrc);
      setFrameLeft(createUnsafeImage(FrameLeft));
      setFrameMiddle(createUnsafeImage(FrameMiddle));
      setFrameRight(createUnsafeImage(FrameRight));
      setImage(createUnsafeImage(imageSrc));

      const context = canvasRef.current.getContext('2d');
      background.onload = () => {
        context.drawImage(background, 0, 0);
      };
    }
  }, [canvasRef, backgroundSrc, imageSrc]);
  
  const addImg = () => {
    if (!(startX && startY && framePartWidth && framePartHeight && imageSrc)) {
      return;
    }

    const imageHeightAdjusted = framePartHeight - 4 * framePartWidth;
    const imageWidthAdjusted = image.width * (imageHeightAdjusted / image.height);


    if (canvasRef?.current) {
      const context = canvasRef.current.getContext('2d');
      let currentX = startX + framePartWidth;
      
      context.drawImage(frameLeft, startX, startY, framePartWidth, framePartHeight);
      for (currentX; (currentX - startX) < (imageWidthAdjusted + 3 * framePartWidth); currentX += framePartWidth) {
        context.drawImage(frameMiddle, currentX, startY, framePartWidth, framePartHeight);
      }
      context.drawImage(frameRight, currentX, startY, framePartWidth, framePartHeight);

      const imagestartX = (startX + currentX + framePartWidth) / 2 - imageWidthAdjusted / 2;
      const imagestartY = startY + 2 * framePartWidth;
      context.drawImage(image, imagestartX, imagestartY, imageWidthAdjusted, imageHeightAdjusted);
    }
  };

  const download = () => {
    if (canvasRef.current) {
      var link = document.createElement('a');
      link.download = 'display-image.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="canvas">
      <canvas ref={canvasRef} width={backgroundWidth} height={backgroundHeight}></canvas>
      <button onClick={addImg}>add image</button>
      <button onClick={download}>download image</button>
    </div>
  );
}

export default Canvas;
