import { useEffect, useState } from "react";
import Canvas from './components/canvas';
import FileUpload from './components/file-upload';
import { backgrounds } from './backgrounds';
import { frames } from './frames';
import { useDebounce } from "./utils/useDebounce";

import './App.css';

function App() {
  const [imageName, setImageName] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [whiteSpace, setWhiteSpace] = useState(50);

  const debouncedWhiteSpace = useDebounce(whiteSpace, 500);

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
  }, [imageSrc, debouncedWhiteSpace]);

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
        <span>
          Adjust white space:
          <input type="number" onChange={(e) => setWhiteSpace(Math.max(0, Number(e.target.value)))} value={whiteSpace} />
        </span>
        {imageSrc && isApplied && <button className="download-all" onClick={handleDownload}>Download all</button>}
      </div>
      <FileUpload setImageName={setImageName} setImageSrc={setImageSrc} />
      <p>{imageName ? `Image name: ${imageName}` : "no files uploaded yet"}</p>
      <div className="frame-radio-buttons">
        {frames.map((frame, idx) => (
          <span key={idx}>
            <input type="radio" value={frame.name} onChange={() => setSelectedFrame(idx)} checked={selectedFrame === idx} />
            <label>{frame.name}</label>
          </span>
        ))}
      </div>
      {imageSrc && imageName && (
        backgrounds.map((background, idx) => (
          <Canvas
            key={idx}
            backgroundName={background.name || `${idx}`}
            backgroundSrc={background.src}
            backgroundWidth={background.width}
            backgroundHeight={background.height}
            framePartHeight={background.framePartHeight}
            startX={background.startX}
            startY={background.startY}
            imageSrc={imageSrc}
            imageName={imageName}
            frameSrcLeft={frames[selectedFrame].srcLeft}
            frameSrcMiddle={frames[selectedFrame].srcMiddle}
            frameSrcRight={frames[selectedFrame].srcRight}
            frameWidthLeft={frames[selectedFrame].widthLeft}
            frameWidthMiddle={frames[selectedFrame].widthMiddle}
            frameWidthRight={frames[selectedFrame].widthRight}
            frameHeight={frames[selectedFrame].height}
            frameThickness={frames[selectedFrame].thickness}
            frameWhiteSpace={debouncedWhiteSpace}
          />
        ))
      )}
    </div>
  );
}

export default App;
