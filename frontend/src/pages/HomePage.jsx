import ThreadsList from "../ThreadsList";
import NewThreadForm from "../NewThreadForm";

function HomePage({ refresh, onThreadAdded }) {
  return (
    <div className="home-page">
      <div className="forum-header">
        <h1>Welcome to ProDiscuss</h1>
        <p className="subtitle">Join the conversation on topics that matter to you</p>
      </div>
      
      <div className="form-container">
        <NewThreadForm onThreadAdded={onThreadAdded} />
      </div>
      
      <ThreadsList refresh={refresh} />
    </div>
  );
}

export default HomePage;