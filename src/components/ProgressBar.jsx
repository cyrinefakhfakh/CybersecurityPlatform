function ProgressBar({ progress }) {
    return (
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    );
  }
  
  export default ProgressBar;
  