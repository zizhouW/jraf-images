import { FileUploader } from "react-drag-drop-files";

import "./styles.css";

const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

export default function FileUpload(props) {
  const handleChange = (file) => {
    const { setImageSrc } = props;
    const fr = new FileReader();
    fr.onload = function () {
      setImageSrc(this.result);
    };
    fr.readAsDataURL(file);
  };

  return (
    <div className="file-upload">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      {/* <p>{file ? `File name: ${file[0].name}` : "no files uploaded yet"}</p> */}
    </div>
  );
}
