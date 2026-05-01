import { Camera } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { setSession } from "../store/session";
import type { Gender } from "../types/api";
import {
  compressImageIfNeeded,
  formatFileSize,
  isSupportedImageType,
  shouldCompressImage
} from "../utils/imageCompression";

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: "female", label: "女性" },
  { value: "male", label: "男性" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [workingFile, setWorkingFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState("");
  const [gender, setGender] = useState<Gender>();
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isPreparing, setIsPreparing] = useState(false);

  const canStart = useMemo(() => Boolean(workingFile && previewUrl && gender), [gender, previewUrl, workingFile]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    setWarning("");

    if (!file) {
      return;
    }

    if (!isSupportedImageType(file.type)) {
      setSelectedFile(undefined);
      setWorkingFile(undefined);
      setPreviewUrl("");
      setError("请上传 JPG、PNG 或 WebP 格式的照片。");
      return;
    }

    setIsPreparing(true);
    setSelectedFile(file);

    try {
      const processedFile = await compressImageIfNeeded(file);
      setWorkingFile(processedFile);
      setPreviewUrl(URL.createObjectURL(processedFile));

      if (shouldCompressImage(file)) {
        setWarning(`原图 ${formatFileSize(file.size)}，已为手机端预览自动压缩。`);
      }
    } catch {
      setWorkingFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setWarning(`图片较大（${formatFileSize(file.size)}），压缩失败，已使用原图继续。`);
    } finally {
      setIsPreparing(false);
    }
  }

  function startAnalysis() {
    if (!selectedFile || !workingFile || !previewUrl || !gender) {
      return;
    }

    setSession({
      originalFile: selectedFile,
      workingFile,
      previewUrl,
      gender,
      warning
    });
    navigate("/analysis");
  }

  return (
    <main className="screen home-screen">
      <header className="app-header">
        <h1>AI 发型设计师</h1>
      </header>

      <section className="upload-panel" aria-label="照片上传">
        <input
          id="photo-upload"
          className="visually-hidden"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="上传头像照片"
          onChange={handleFileChange}
        />
        <label className="upload-target" htmlFor="photo-upload">
          {previewUrl ? (
            <img className="preview-image" src={previewUrl} alt="头像预览" />
          ) : (
            <span className="upload-empty">
              <Camera size={42} />
              <span>上传头像</span>
            </span>
          )}
        </label>
        {selectedFile ? <p className="upload-meta">{selectedFile.name}</p> : null}
      </section>

      <section className="field-group" aria-label="选择性别">
        <h2>选择性别</h2>
        <div className="segmented-control">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={gender === option.value ? "segment active" : "segment"}
              type="button"
              onClick={() => setGender(option.value)}
              aria-pressed={gender === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {error ? <p className="message error">{error}</p> : null}
      {warning ? <p className="message warning">{warning}</p> : null}

      <div className="bottom-action">
        <button className="primary-button" type="button" disabled={!canStart || isPreparing} onClick={startAnalysis}>
          {isPreparing ? "准备照片中" : "开始分析"}
        </button>
      </div>
    </main>
  );
}
