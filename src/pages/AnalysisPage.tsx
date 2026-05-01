import { ArrowLeft, RefreshCw, Scissors } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { analyzeFace, generateHairstyles, uploadImage } from "../services/api";
import { clearSession, getSession, updateSession } from "../store/session";

export default function AnalysisPage() {
  const navigate = useNavigate();
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
        const uploadResponse = await uploadImage(session.workingFile as File);
        if (cancelled) return;

        const analysisResponse = await analyzeFace({ imageUrl: uploadResponse.imageUrl });
        if (cancelled) return;

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

        <h1>正在生成发型</h1>
        <p>请稍候片刻</p>

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
