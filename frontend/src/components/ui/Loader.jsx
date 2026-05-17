const Loader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-16 h-16">
        {/* Cercle extérieur */}
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
        {/* Cercle intérieur animé avec dégradé */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-purple-600 animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
