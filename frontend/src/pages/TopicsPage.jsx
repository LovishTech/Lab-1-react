function TopicsPage() {
  const topics = [
    {
      id: 1,
      title: "Technology",
      description: "Discuss the latest tech trends and innovations",
      threadCount: 23
    },
    {
      id: 2,
      title: "Science",
      description: "Explore scientific discoveries and breakthroughs",
      threadCount: 18
    },
    {
      id: 3,
      title: "Art & Design",
      description: "Share creative works and design inspiration",
      threadCount: 15
    },
    {
      id: 4,
      title: "Business",
      description: "Talk about entrepreneurship and business strategies",
      threadCount: 20
    }
  ];
  
  const handleExplore = (topicId) => {
    // Navigation function to redirect to the specific topic page
    console.log(`Navigating to topic ${topicId}`);
    // You can replace this with your actual navigation logic
    // For example: navigate(`/topics/${topicId}`)
    alert(`Exploring topic: ${topics.find(topic => topic.id === topicId).title}`);
  };

  return (
    <div className="topics-page p-6 max-w-6xl mx-auto">
      <div className="forum-header mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Forum Topics</h1>
        <p className="subtitle text-gray-600">Explore our various discussion categories</p>
      </div>
      
      <div className="topics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map(topic => (
          <div key={topic.id} className="card topic-card bg-white rounded-lg shadow-md p-5 border border-gray-200 transition-all hover:shadow-lg">
            <h3 className="topic-title text-xl font-semibold mb-2">{topic.title}</h3>
            <p className="topic-description text-gray-700 mb-4">{topic.description}</p>
            <div className="topic-meta mb-4">
              <span className="thread-count text-sm text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {topic.threadCount} threads
              </span>
            </div>
            <button 
              onClick={() => handleExplore(topic.id)} 
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopicsPage;