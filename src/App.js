import Canvas from './components/canvas';
import TestImage from './test_image_300_168.jpg';
import TestImage2 from './test_image_500_500.jpg';
import TestImage3 from './test_image_340_270.jpg';
import { backgrounds } from './backgrounds';

import './App.css';

function App() {
  return (
    <div className="App">
      {backgrounds.map((background) => (
        <Canvas
          backgroundSrc={background.src}
          backgroundWidth={background.width}
          backgroundHeight={background.height}
          framePartWidth={background.framePartWidth}
          framePartHeight={background.framePartHeight}
          startX={background.startX}
          startY={background.startY}
          imageSrc={TestImage2}
          />
      ))}
    </div>
  );
}

export default App;
