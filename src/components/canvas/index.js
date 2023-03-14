import { useCallback, useEffect, useRef, useState } from 'react';

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
    framePartHeight,
    imageSrc,
    imageName,
    frameSrcLeft,
    frameSrcMiddle,
    frameSrcRight,
    frameWidthLeft,
    frameWidthMiddle,
    frameWidthRight,
    frameHeight,
    frameThickness,
    frameWhiteSpace,
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
      setFrameLeft(createUnsafeImage(frameSrcLeft));
      setFrameMiddle(createUnsafeImage(frameSrcMiddle));
      setFrameRight(createUnsafeImage(frameSrcRight));
      setImage(createUnsafeImage(imageSrc));

      const context = canvasRef.current.getContext('2d');
      bg.onload = () => {
        context.drawImage(bg, 0, 0);
      };
    }
  }, [canvasRef, backgroundSrc, imageSrc, frameSrcLeft, frameSrcMiddle, frameSrcRight, frameWhiteSpace]);
  
  const applyImg = useCallback(() => {
    if (!(startX && startY && framePartHeight && imageSrc && frameLeft &&
      frameMiddle && frameRight && frameWidthLeft && frameWidthMiddle &&
      frameWidthRight && frameHeight && frameThickness && frameWhiteSpace !== undefined)) {
      return;
    }

    const frameWidthMultiplier = framePartHeight / frameHeight;

    const frameWidthLeftAdjusted = frameWidthLeft * frameWidthMultiplier;
    const frameWidthMiddleAdjusted = frameWidthMiddle * frameWidthMultiplier;
    const frameWidthRightAdjusted = frameWidthRight * frameWidthMultiplier;
    const frameThicknessAdjusted = frameThickness * frameWidthMultiplier;

    const imageHeightAdjusted = framePartHeight - 2 * (frameThicknessAdjusted + frameWhiteSpace);
    const imageWidthAdjusted = image.width * (imageHeightAdjusted / image.height);

    if (canvasRef?.current) {
      const context = canvasRef.current.getContext('2d');
      let currentX = startX + frameWidthLeftAdjusted;
      
      context.drawImage(frameLeft, startX, startY, frameWidthLeftAdjusted, framePartHeight);
      for (currentX; (currentX - startX) < (frameWidthLeftAdjusted + imageWidthAdjusted + 2 * frameWhiteSpace); currentX += frameWidthMiddleAdjusted) {
        context.drawImage(frameMiddle, currentX, startY, frameWidthMiddleAdjusted, framePartHeight);
      }
      context.drawImage(frameRight, currentX, startY, frameWidthRightAdjusted, framePartHeight);

      const imagestartX = (startX + currentX + frameWidthLeftAdjusted) / 2 - imageWidthAdjusted / 2;
      const imagestartY = startY + frameThicknessAdjusted + frameWhiteSpace;
      context.drawImage(image, imagestartX, imagestartY, imageWidthAdjusted, imageHeightAdjusted);

      setIsShowDownload(true);
    }
  }, [frameHeight, frameLeft, frameMiddle, framePartHeight, frameRight, frameThickness, frameWidthLeft, frameWidthMiddle, frameWidthRight, image, imageSrc, startX, startY, frameWhiteSpace]);

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
      default:
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
