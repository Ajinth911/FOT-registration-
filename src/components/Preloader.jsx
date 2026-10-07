import { useState, useEffect } from "react";

function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    let animationFrame;
    const startTime = performance.now();
    const duration = 1400; // 1.4 seconds smooth loading

    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const currentVal = Math.min(Math.round(ease(progressRatio) * 100), 100);

      setProgress(currentVal);

      if (progressRatio < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setTimeout(() => setIsLoaded(true), 200);
        setTimeout(() => setIsRemoved(true), 1100);
      }
    };

    animationFrame = requestAnimationFrame(step);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (isRemoved) return null;

  const renderContent = () => (
    <div className="preloader-content">
      <div className="preloader-logo-wrapper">
        <img
          src="/herologo.png"
          alt="MAKKA DESIGN PAKKA"
          className="preloader-logo preloader-logo-white"
        />
        <div
          className="preloader-logo-fill-layer"
          style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
        >
          <img
            src="/herologo.png"
            alt="MAKKA DESIGN PAKKA"
            className="preloader-logo preloader-logo-color"
          />
        </div>
      </div>

      <div className="preloader-progress-box">
        <div
          className="preloader-progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="preloader-status">
        <span className="preloader-tag">Designing...</span>
        <span className="preloader-percentage">{progress}%</span>
      </div>
    </div>
  );

  return (
    <div
      className={`preloader-wrapper ${isLoaded ? "loaded" : ""}`}
      aria-hidden={isLoaded}
    >
      <div className="preloader-curtain preloader-curtain-left">
        <div className="preloader-stage preloader-stage-left">
          {renderContent()}
        </div>
      </div>

      <div className="preloader-curtain preloader-curtain-right">
        <div className="preloader-stage preloader-stage-right">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Preloader;
