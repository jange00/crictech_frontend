const HeroMedia = ({ videoSrc = null, posterSrc }) => (
  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-blue-200/50 bg-white shadow-2xl shadow-blue-500/10 ring-1 ring-slate-200/50">
    {videoSrc ? (
      <video
        className="h-full w-full min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    ) : (
      <img className="h-full w-full min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] object-cover" src={posterSrc} alt="Bowler with AI overlays" />
    )}
    <div className="absolute inset-x-3 sm:inset-x-4 md:inset-x-5 bottom-3 sm:bottom-4 md:bottom-5 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg sm:rounded-xl border border-blue-300/60 bg-white/95 backdrop-blur-sm p-2 sm:p-3 md:p-4 shadow-lg">
        <span className="block text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-slate-600 font-medium">Release Angle</span>
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 mt-0.5 sm:mt-1">32°</span>
      </div>
      <div className="rounded-lg sm:rounded-xl border border-blue-300/60 bg-white/95 backdrop-blur-sm p-2 sm:p-3 md:p-4 shadow-lg">
        <span className="block text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-slate-600 font-medium">Spin Rate</span>
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-slate-900 mt-0.5 sm:mt-1">1850 rpm</span>
      </div>
      <div className="rounded-lg sm:rounded-xl border-2 border-blue-500 bg-blue-50 p-2 sm:p-3 md:p-4 shadow-lg sm:col-span-2 lg:col-span-1">
        <span className="block text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-blue-700 font-medium">AI Accuracy</span>
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-700 mt-0.5 sm:mt-1">92%</span>
      </div>
    </div>
  </div>
);

export default HeroMedia;
