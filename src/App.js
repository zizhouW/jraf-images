import { useEffect, useRef, useState } from 'react';
import FrameLeft from './frame-left.png';
import FrameMiddle from './frame-middle.png';
import FrameRight from './frame-right.png';
import TestBackground from './test-background.jpg';
import TestImage from './test_image_300_168.jpg';
import './App.css';

const paintWidth = 300;
const paintHeight = 168;
const FRAME_PART_WIDTH = 7;
const FRAME_PART_HEIGHT = 206;
const startingX = 220;
const startingY = 40;

const createUnsafeImage = (src) => {
  const image = new Image();
  image.src = src;
  image.setAttribute('crossorigin', 'anonymous');

  return image;
}

function App() {
  const canvasRef = useRef();
  const [frameLeft, setFrameLeft] = useState(null);
  const [frameMiddle, setFrameMiddle] = useState(null);
  const [frameRight, setFrameRight] = useState(null);

  useEffect(() => {
    if (canvasRef?.current) {
      const background = createUnsafeImage(TestBackground);
      setFrameLeft(createUnsafeImage(FrameLeft));
      setFrameMiddle(createUnsafeImage(FrameMiddle));
      setFrameRight(createUnsafeImage(FrameRight));

      const context = canvasRef.current.getContext('2d');
      background.onload = () => {
        context.drawImage(background, 0, 0);
      };
    }
  }, [canvasRef]);
  
  const addImg = () => {
    const imageStartingX = startingX + 2 * FRAME_PART_WIDTH;
    const imageStartingY = startingY + FRAME_PART_WIDTH + Math.max(FRAME_PART_HEIGHT - paintHeight - 2 * FRAME_PART_WIDTH, 0) / 2;

    if (canvasRef?.current) {
      const context = canvasRef.current.getContext('2d');
      const testImage = createUnsafeImage(TestImage);
      let currentX = startingX + FRAME_PART_WIDTH;
      
      context.drawImage(frameLeft, startingX, startingY, FRAME_PART_WIDTH, FRAME_PART_HEIGHT);
      for (currentX; (currentX - startingX) < (paintWidth + 3 * FRAME_PART_WIDTH); currentX += FRAME_PART_WIDTH) {
        context.drawImage(frameMiddle, currentX, startingY, FRAME_PART_WIDTH, FRAME_PART_HEIGHT);
      }
      context.drawImage(frameRight, currentX, startingY, FRAME_PART_WIDTH, FRAME_PART_HEIGHT);

      testImage.onload = function() {
        context.drawImage(testImage, imageStartingX, imageStartingY, paintWidth, paintHeight);
      };
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
    <div className="App">
      <canvas ref={canvasRef} width={626} height={416}></canvas>
      <button onClick={addImg}>add image</button>
      <button onClick={download}>download image</button>
    </div>
  );
}

export default App;
