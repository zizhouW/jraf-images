import { useEffect, useState } from "react";
import Canvas from './components/canvas';
import FileUpload from './components/file-upload';
// import TestImage from './test_image_300_168.jpg';
// import TestImage2 from './test_image_500_500.jpg';
// import TestImage3 from './test_image_340_270.jpg';
import { backgrounds } from './backgrounds';

import './App.css';

function App() {
  const [imageName, setImageName] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    const applyButtons = [...document.getElementsByClassName('canvas__apply-image')];

    applyButtons.forEach((button) => {
      button.click();
    });

    if (applyButtons.length) {
      setIsApplied(true);
    }
  };

  useEffect(() => {
    if (imageSrc) {
      setTimeout(() => {
        handleApply();
      }, 100);
    }
  }, [imageSrc]);

  const handleDownload = () => {
    const downloadButtons = [...document.getElementsByClassName('canvas__download')];

    downloadButtons.forEach((button) => {
      button.click();
    });
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Upload file or use drag & drop</h1>
        {imageSrc && isApplied && <button className="download-all" onClick={handleDownload}>Download all</button>}
      </div>
      <FileUpload setImageName={setImageName} setImageSrc={setImageSrc} />
      <p>{imageName ? `Image name: ${imageName}` : "no files uploaded yet"}</p>
      {imageSrc && imageName && (
        backgrounds.map((background, idx) => (
          <Canvas
            key={idx}
            backgroundName={background.name || `${idx}`}
            backgroundSrc={background.src}
            backgroundWidth={background.width}
            backgroundHeight={background.height}
            framePartWidth={background.framePartWidth}
            framePartHeight={background.framePartHeight}
            startX={background.startX}
            startY={background.startY}
            imageSrc={imageSrc}
            imageName={imageName}
          />
        ))
      )}
    </div>
  );
}

export default App;
