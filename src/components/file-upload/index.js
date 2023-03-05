import { FileUploader } from "react-drag-drop-files";

import "./styles.css";

const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

export default function FileUpload(props) {
  const handleChange = (file) => {
    const { setImageName, setImageSrc } = props;
    const fr = new FileReader();

    fr.onload = function () {
      setImageSrc(this.result);
    };

    fr.readAsDataURL(file);
    setImageName(file.name.split('.').slice(0, -1).join('.'));
  };

  return (
    <div className="file-upload">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
    </div>
  );
}
