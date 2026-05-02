import { ArrowLeft, Download, RotateCcw } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { clearSession, getSession, updateSession } from "../store/session";

export default function ResultPage() {
  const navigate = useNavigate();
  const session = getSession();

  if (!session.hairstyles?.length) {
    return <Navigate to="/" replace />;
  }

  function returnHome() {
    clearSession();
    navigate("/", { replace: true });
  }

  function regenerate() {
    updateSession({ hairstyles: undefined });
    navigate("/analysis", { replace: true });
  }

  return (
    <main className="screen result-screen">
      <header className="compact-header">
        <button className="icon-button" type="button" onClick={returnHome} aria-label="返回首页">
          <ArrowLeft size={20} />
        </button>
        <span>生成结果</span>
      </header>

      <section className="result-summary">
        <h1>发型预览</h1>
      </section>

      <section className="result-list" aria-label="发型结果">
        {session.hairstyles.map((style, index) => (
          <article className="result-card" key={style.styleId}>
            <img src={style.imageUrl} alt={`${style.name} 发型效果图`} />
            <div className="result-card-body">
              <span className="result-index">方案 {index + 1}</span>
              <h2>{style.name}</h2>
              <p>{style.advice}</p>
              <a className="save-link" href={style.imageUrl} download={`${style.name}.svg`} aria-label="保存图片">
                <Download size={18} />
                保存图片
              </a>
            </div>
          </article>
        ))}
      </section>

      <div className="bottom-action">
        <button className="secondary-button wide" type="button" onClick={regenerate}>
          <RotateCcw size={18} />
          重新生成
        </button>
      </div>
    </main>
  );
}
