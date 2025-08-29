import React from 'react';

const YouTubeVideoSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Watch how KinPin works</h2>
        <div className="w-full rounded-xl overflow-hidden shadow-lg">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              title="KinPin Introduction"
              src="https://www.youtube-nocookie.com/embed/DnTrDh5DeIQ?rel=0&modestbranding=1"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeVideoSection;


