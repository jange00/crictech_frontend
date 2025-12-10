import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  CloudArrowUpIcon,
  VideoCameraIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useVideos } from "../../../hooks/useVideos";
import { useAnalysis } from "../../../hooks/useAnalysis";
import { useSocket } from "../../../hooks/useSocket";
import { toast } from "react-toastify";

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime"];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const UploadWorkflow = ({ isDarkMode, onUploadComplete, onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading' | 'uploaded' | 'processing' | 'processed' | 'failed'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState(null); // 'pending' | 'processing' | 'completed' | 'failed'
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);

  const inputRef = useRef(null);
  const { uploadVideoAsync, isUploading: isUploadingFromHook } = useVideos();
  const { startAnalysisAsync, isStarting } = useAnalysis();

  // Socket event handlers
  const handleUploadProgress = useCallback((data) => {
    // Handle upload progress for current session or if sessionId matches
    if (!sessionId || data.sessionId === sessionId || data.sessionId === null) {
      setUploadProgress(data.progress || 0);
      if (data.progress === 100) {
        setUploadStatus('uploaded');
        setIsUploading(false);
        toast.success('Video uploaded successfully!');
      } else if (data.progress > 0) {
        setUploadStatus('uploading');
        setIsUploading(true);
      }
    }
  }, [sessionId]);

  const handleAnalysisProgress = useCallback((data) => {
    if (data.sessionId === sessionId) {
      setAnalysisProgress(data.progress || 0);
      setAnalysisStatus(data.status);
      setCurrentAnalysisStep(data.currentStep || "");
      setIsAnalyzing(data.status === 'processing');
      
      if (data.status === 'failed') {
        setIsAnalyzing(false);
        toast.error('Analysis failed. Please try again.');
      }
    }
  }, [sessionId]);

  const handleAnalysisCompleteEvent = useCallback((data) => {
    if (data.sessionId === sessionId) {
      setIsAnalyzing(false);
      setAnalysisStatus('completed');
      setAnalysisProgress(100);
      if (data.analysisId) {
        setAnalysisId(data.analysisId);
      }
      toast.success(data.message || 'Analysis completed successfully!');
      if (onAnalysisComplete) {
        onAnalysisComplete({
          analysisId: data.analysisId,
          sessionId: data.sessionId,
          metrics: data.metrics,
        });
      }
    }
  }, [sessionId, onAnalysisComplete]);

  // Setup socket listeners
  const { socket } = useSocket({
    onUploadProgress: handleUploadProgress,
    onAnalysisProgress: handleAnalysisProgress,
    onAnalysisComplete: handleAnalysisCompleteEvent,
  });

  useEffect(() => {
    if (!file) {
      setVideoUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelectFile = async (selectedFile) => {
    if (!selectedFile) return;
    
    // Validate file type
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      toast.error("Please upload an .mp4 or .mov video file.");
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 500MB limit. Please upload a smaller file.");
      return;
    }

    setFile(selectedFile);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setIsUploading(true);
    setAnalysisStatus(null);
    setAnalysisProgress(0);
    setCurrentAnalysisStep("");

    try {
      // Upload video
      const response = await uploadVideoAsync({
        videoFile: selectedFile,
        onUploadProgress: (percent) => {
          setUploadProgress(percent);
        },
      });

      // Backend returns: { success: true, video: {...} }
      if (response?.success && response.video) {
        const video = response.video;
        const newSessionId = video.id || video._id || video.sessionId;
        setSessionId(newSessionId);
        setUploadStatus(video.uploadStatus || video.status || 'uploaded');
        // Use the video URL from the response if available
        if (video.videoUrl || video.url) {
          setVideoUrl(video.videoUrl || video.url);
        }
        setIsUploading(false);
        onUploadComplete?.(video.originalFileName || video.filename || selectedFile.name);
        
        // Note: Upload status may still be 'uploading' - socket will update it
        // Wait for socket event to confirm upload is complete
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadStatus('failed');
      toast.error(error.message || 'Failed to upload video');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    handleSelectFile(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    handleSelectFile(selectedFile);
  };

  const handleRecord = () => {
    toast.info("Recording support is not available yet. Upload an existing video instead.");
  };

  const handleAnalyze = async () => {
    if (!sessionId) {
      toast.error('Please upload a video first');
      return;
    }

    if (uploadStatus !== 'uploaded' && uploadStatus !== 'processed') {
      toast.error('Please wait for video upload to complete');
      return;
    }

    // Check if analysis already exists for this session
    if (analysisStatus === 'completed') {
      toast.info('Analysis already completed for this video');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStatus('pending');
    setAnalysisProgress(0);
    setCurrentAnalysisStep("Starting analysis...");

    try {
      // Request analysis via socket (triggers analysis if not already started)
      if (socket) {
        socket.requestAnalysis(sessionId);
      }

      // Call API to start analysis
      const response = await startAnalysisAsync(sessionId);
      
      if (response?.success && response.analysis) {
        const newAnalysisId = response.analysis.id || response.analysis._id;
        setAnalysisId(newAnalysisId);
        setAnalysisStatus(response.analysis.status || 'processing');
        setAnalysisProgress(response.analysis.progress || 0);
        // Don't show toast here - socket will handle completion
      } else {
        throw new Error(response?.message || 'Failed to start analysis');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      setAnalysisStatus('failed');
      toast.error(error.message || 'Failed to start analysis');
    }
  };

  const dragClasses = useMemo(
    () =>
      `${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : isDarkMode
          ? "border-slate-700 bg-slate-900"
          : "border-dashed border-slate-300 bg-white"
      }`,
    [isDarkMode, isDragging]
  );

  const currentStep = useMemo(() => {
    if (analysisStatus === 'completed') return 3;
    if (uploadStatus === 'uploaded' || uploadStatus === 'processed' || videoUrl) return 2;
    return 1;
  }, [analysisStatus, uploadStatus, videoUrl]);

  return (
    <div className="flex flex-col gap-6">
      <div className={`flex flex-wrap items-center gap-3 rounded-3xl border px-4 py-3 ${isDarkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
        {["Upload", "Preview", "Analyze"].map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
          return (
            <div key={step} className="flex items-center gap-2 text-sm font-semibold">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isActive
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {stepNumber}
              </span>
              <span className={isActive ? "text-blue-600" : "text-slate-400"}>{step}</span>
              {index < 2 && <span className="text-slate-300">�</span>}
            </div>
          );
        })}
      </div>

      <section
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex flex-col gap-4 rounded-3xl border-2 border-dashed p-8 text-center transition ${dragClasses}`}
      >
        <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${isDragging ? "text-blue-600" : "text-blue-500"}`} />
        <div className="space-y-2">
          <p className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
            Drag & drop your bowling video
          </p>
          <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            or click the button below. Accepted formats: .mp4, .mov (max 500MB)
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            Choose Video
          </button>
          <button
            type="button"
            onClick={handleRecord}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              isDarkMode
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            <VideoCameraIcon className="h-5 w-5" />
            Record Video
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          className="hidden"
          onChange={handleInputChange}
        />
        {(isUploading || uploadStatus === 'uploading') && (
          <div className="mx-auto mt-4 w-full max-w-xl">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
      </section>

      <div className={`flex items-start gap-3 rounded-3xl border p-5 ${isDarkMode ? "border-slate-700 bg-slate-900 text-slate-200" : "border-slate-200 bg-white text-slate-700"}`}>
        <InformationCircleIcon className="mt-1 h-5 w-5 text-blue-500" />
        <div className="text-sm leading-relaxed">
          <p className="font-semibold text-blue-600">Best capture tips</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Record at 60fps or higher from the side-on angle covering gather to follow-through.</li>
            <li>Ensure the bowler occupies 70% of the frame and the crease is visible.</li>
            <li>Upload within 500MB for fastest analysis turnaround.</li>
          </ul>
        </div>
      </div>


      {videoUrl && (
        <section
          className={`grid gap-6 rounded-3xl border p-6 transition ${
            isDarkMode ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,auto)_minmax(0,260px)]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                <video src={videoUrl} controls className="h-full w-full bg-black" />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !sessionId || (uploadStatus !== 'uploaded' && uploadStatus !== 'processed') || analysisStatus === 'completed'}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  {analysisStatus === 'completed' ? "Analysis Complete" : isAnalyzing ? "Analyzing..." : "Analyze Now"}
                </button>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  Replace Video
                </button>
              </div>
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                isDarkMode ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-slate-50"
              }`}
            >
              <h4 className="mb-3 text-sm font-semibold text-blue-600">Video Info</h4>
              <ul className="space-y-2 text-sm">
                {file && (
                  <>
                    <li className="flex items-center justify-between">
                      <span>File Name</span>
                      <span className="text-xs text-slate-500 truncate max-w-[150px]">{file.name}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>File Size</span>
                      <span className="text-xs text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Status</span>
                      <span className={`text-xs font-semibold ${
                        uploadStatus === 'uploaded' || uploadStatus === 'processed'
                          ? "text-emerald-600"
                          : uploadStatus === 'failed'
                          ? "text-rose-600"
                          : "text-blue-600"
                      }`}>
                        {uploadStatus || 'Ready'}
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {(isAnalyzing || analysisStatus === 'processing') && (
            <div
              className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 text-sm ${
                isDarkMode
                  ? "border-blue-900 bg-blue-950/50 text-blue-200"
                  : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              <div className="flex items-center gap-3 font-semibold">
                <span
                  className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                    isDarkMode ? "border-blue-300" : "border-blue-500"
                  }`}
                />
                Analyzing Bowling Mechanics�
              </div>
              {currentAnalysisStep && (
                <p className="text-xs opacity-80">{currentAnalysisStep}</p>
              )}
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>Progress</span>
                  <span>{analysisProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200/50">
                  <div className="h-full bg-blue-600 transition-all" style={{ width: `${analysisProgress}%` }} />
                </div>
              </div>
            </div>
          )}

          {analysisStatus === 'completed' && (
            <div className={`rounded-2xl border p-4 text-sm ${
              isDarkMode
                ? "border-emerald-800 bg-emerald-950/50 text-emerald-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Analysis Completed Successfully!</p>
                  <p className="text-xs opacity-80 mt-1">
                    View detailed feedback in the Analysis section or click below to see results.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default UploadWorkflow;
