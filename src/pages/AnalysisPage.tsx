import { ArrowLeft, RefreshCw, Scissors } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { analyzeFace, generateHairstyles, uploadImage } from "../services/api";
import { clearSession, getSession, updateSession } from "../store/session";

type StepKey = "upload" | "analyze" | "generate";

const STEP_LABELS: Record<StepKey, string> = {
  upload: "压缩照片",
  analyze: "分析脸型",
  generate: "生成发型方案"
};

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<StepKey>("upload");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const session = getSession();

  useEffect(() => {
    if (!session.workingFile || !session.previewUrl || !session.gender) {
      navigate("/", { replace: true });
      return;
    }

    let cancelled = false;

    async function runAnalysis() {
      try {
        setError("");
        setActiveStep("upload");
        const uploadResponse = await uploadImage(session.workingFile as File);
        if (cancelled) return;

        setActiveStep("analyze");
        const analysisResponse = await analyzeFace({ imageUrl: uploadResponse.imageUrl });
        if (cancelled) return;

        setActiveStep("generate");
        const generationResponse = await generateHairstyles({
          imageUrl: uploadResponse.imageUrl,
          faceType: analysisResponse.faceType,
          gender: session.gender!
        });
        if (cancelled) return;

        updateSession({
          uploadedImageUrl: uploadResponse.imageUrl,
          faceType: analysisResponse.faceType,
          confidence: analysisResponse.confidence,
          hairstyles: generationResponse.results
        });
        navigate("/result", { replace: true });
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError instanceof Error ? caughtError.message : "生成失败，请重试");
        }
      }
    }

    void runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [attempt, navigate, session.gender, session.previewUrl, session.workingFile]);

  function returnHome() {
    clearSession();
    navigate("/", { replace: true });
  }

  return (
    <main className="screen analysis-screen">
      <header className="compact-header">
        <button className="icon-button" type="button" onClick={returnHome} aria-label="返回首页">
          <ArrowLeft size={20} />
        </button>
        <span>AI 发型设计师</span>
      </header>

      <section className="analysis-panel">
        <div className="analysis-photo-wrap">
          {session.previewUrl ? <img className="analysis-photo" src={session.previewUrl} alt="待分析头像" /> : null}
          <div className="spinner" aria-hidden="true">
            <Scissors size={26} />
          </div>
        </div>

        <h1>分析中，请稍候</h1>
        <p>正在根据脸型比例生成适合你的发型方向。</p>

        <ol className="step-list" aria-label="分析进度">
          {(Object.keys(STEP_LABELS) as StepKey[]).map((step) => (
            <li key={step} className={step === activeStep ? "active" : ""}>
              <span />
              {STEP_LABELS[step]}
            </li>
          ))}
        </ol>

        {error ? (
          <div className="error-panel" role="alert">
            <p>{error}</p>
            <div className="button-row">
              <button className="secondary-button" type="button" onClick={() => setAttempt((value) => value + 1)}>
                <RefreshCw size={16} />
                重试
              </button>
              <button className="text-button" type="button" onClick={returnHome}>
                返回首页
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
