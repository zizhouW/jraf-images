import { useEffect, useRef, useState } from 'react';
import FrameLeft from './frame-left.png';
import FrameMiddle from './frame-middle.png';
import FrameRight from './frame-right.png';

import './styles.css';

const createUnsafeImage = (src) => {
  const image = new Image();
  image.src = src;
  image.setAttribute('crossorigin', 'anonymous');

  return image;
}

function Canvas(props) {
  const {
    backgroundName,
    backgroundSrc,
    backgroundWidth,
    backgroundHeight,
    startX: origStartX,
    startY: origStartY,
    framePartWidth,
    framePartHeight,
    imageSrc,
    imageName,
  } = props;

  const canvasRef = useRef();
  const [background, setBackground] = useState(null);
  const [frameLeft, setFrameLeft] = useState(null);
  const [frameMiddle, setFrameMiddle] = useState(null);
  const [frameRight, setFrameRight] = useState(null);
  const [image, setImage] = useState(null);
  const [isShowDownload, setIsShowDownload] = useState(false);
  const [startX, setStartX] = useState(origStartX);
  const [startY, setStartY] = useState(origStartY);

  useEffect(() => {
    if (canvasRef?.current) {
      const bg = createUnsafeImage(backgroundSrc);
      setBackground(bg);
      setFrameLeft(createUnsafeImage(FrameLeft));
      setFrameMiddle(createUnsafeImage(FrameMiddle));
      setFrameRight(createUnsafeImage(FrameRight));
      setImage(createUnsafeImage(imageSrc));

      const context = canvasRef.current.getContext('2d');
      bg.onload = () => {
        context.drawImage(bg, 0, 0);
      };
    }
  }, [canvasRef, backgroundSrc, imageSrc]);
  
  const applyImg = () => {
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

      setIsShowDownload(true);
    }
  };

  const download = () => {
    if (canvasRef.current) {
      var link = document.createElement('a');
      link.download = `${imageName}-${backgroundName}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const applyMoveImageXY = () => {
    if (canvasRef?.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(background, 0, 0);
      applyImg();
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        setStartY(startY - 1);
        applyMoveImageXY();
        break;
      case 'ArrowDown':
        setStartY(startY + 1);
        applyMoveImageXY();
        break;
      case 'ArrowLeft':
        setStartX(startX - 1);
        applyMoveImageXY();
        break;
      case 'ArrowRight':
        setStartX(startX + 1);
        applyMoveImageXY();
        break;
    }
  };

  return (
    <div className="canvas">
      <canvas ref={canvasRef} width={backgroundWidth} height={backgroundHeight}></canvas>
      <button className="canvas__apply-image" onClick={applyImg}>apply image</button>
      {isShowDownload && <button className="canvas__download" onClick={download}>download</button>}
      {isShowDownload && <input className='input-adjust' onKeyDown={handleKeyDown} placeholder='Use array keys to further adjust' />}
    </div>
  );
}

export default Canvas;
