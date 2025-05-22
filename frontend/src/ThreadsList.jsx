// Updated ThreadsList component with fixes for replying, deleting, and updating threads

import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';

function ThreadsList({ refresh }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [editingThread, setEditingThread] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState("");
  const [replies, setReplies] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const [replyError, setReplyError] = useState({});
  const [operations, setOperations] = useState({
    deleting: {},
    updating: {},
    replying: {}
  });

  // Load threads
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/api/threads")
      .then(res => {
        const threadsWithLikes = res.data.map(thread => ({
          ...thread,
          likeCount: thread.likeCount || 0
        }));
        setThreads(threadsWithLikes);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading threads:", err);
        setError("Failed to load threads. Please try again later.");
        setLoading(false);
      });
  }, [refresh]);

  // Load replies for a thread
  const fetchReplies = async (threadId) => {
    try {
      setOperations(prev => ({
        ...prev,
        replying: { ...prev.replying, [threadId]: true }
      }));
      
      const res = await axios.get(`http://localhost:5000/api/threads/${threadId}/replies`);
      setReplies(prev => ({ ...prev, [threadId]: res.data }));
      
      setOperations(prev => ({
        ...prev,
        replying: { ...prev.replying, [threadId]: false }
      }));
    } catch (err) {
      console.error("Error fetching replies:", err);
      setReplies(prev => ({ ...prev, [threadId]: [] }));
      
      setOperations(prev => ({
        ...prev,
        replying: { ...prev.replying, [threadId]: false }
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleThreadClick = (threadId) => {
    setSelectedThread(selectedThread === threadId ? null : threadId);
    if (selectedThread !== threadId) fetchReplies(threadId);
  };

  const handleVote = (threadId, isLike) => {
    if (userVotes[threadId]) return;
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === threadId
          ? { ...thread, likeCount: thread.likeCount + (isLike ? 1 : -1) }
          : thread
      )
    );
    setUserVotes(prev => ({
      ...prev,
      [threadId]: isLike ? 'like' : 'dislike'
    }));
    axios.post(`http://localhost:5000/api/threads/${threadId}/vote`, { isLike })
      .catch((err) => {
        console.error("Error voting:", err);
        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.id === threadId
              ? { ...thread, likeCount: thread.likeCount + (isLike ? -1 : 1) }
              : thread
          )
        );
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[threadId];
          return newVotes;
        });
      });
  };

  const handleDelete = async (threadId) => {
    if (!window.confirm("Are you sure you want to delete this thread?")) return;
    
    try {
      setOperations(prev => ({
        ...prev,
        deleting: { ...prev.deleting, [threadId]: true }
      }));
      
      await axios.delete(`http://localhost:5000/api/threads/${threadId}`);
      setThreads(threads => threads.filter(thread => thread.id !== threadId));
      
      setOperations(prev => ({
        ...prev,
        deleting: { ...prev.deleting, [threadId]: false }
      }));
    } catch (err) {
      console.error("Error deleting thread:", err);
      alert("Failed to delete thread. Please try again.");
      
      setOperations(prev => ({
        ...prev,
        deleting: { ...prev.deleting, [threadId]: false }
      }));
    }
  };

  const handleEdit = (thread) => {
    setEditingThread(thread.id);
    setEditTitle(thread.title);
    setEditContent(thread.content);
    setEditError("");
  };

  const handleEditCancel = () => {
    setEditingThread(null);
    setEditTitle("");
    setEditContent("");
    setEditError("");
  };

  const handleEditSave = async (threadId) => {
    if (!editTitle.trim() || !editContent.trim()) {
      setEditError("Title and content cannot be empty.");
      return;
    }
    
    try {
      setOperations(prev => ({
        ...prev,
        updating: { ...prev.updating, [threadId]: true }
      }));
      
      const res = await axios.put(`http://localhost:5000/api/threads/${threadId}`, {
        title: editTitle,
        content: editContent
      });
      
      setThreads(threads =>
        threads.map(thread =>
          thread.id === threadId ? { ...thread, title: res.data.title, content: res.data.content } : thread
        )
      );
      
      setEditingThread(null);
      setEditTitle("");
      setEditContent("");
      setEditError("");
      
      setOperations(prev => ({
        ...prev,
        updating: { ...prev.updating, [threadId]: false }
      }));
    } catch (err) {
      console.error("Error updating thread:", err);
      setEditError("Failed to update thread. Please try again.");
      
      setOperations(prev => ({
        ...prev,
        updating: { ...prev.updating, [threadId]: false }
      }));
    }
  };

  // --- Reply logic ---
  const handleReplyChange = (threadId, value) => {
    setReplyContent(prev => ({ ...prev, [threadId]: value }));
    
    // Clear any previous error when user starts typing
    if (replyError[threadId]) {
      setReplyError(prev => ({ ...prev, [threadId]: "" }));
    }
  };

  const handleReplySubmit = async (threadId) => {
    const content = replyContent[threadId];
    if (!content || !content.trim()) {
      setReplyError(prev => ({ ...prev, [threadId]: "Reply cannot be empty." }));
      return;
    }
    
    try {
      setOperations(prev => ({
        ...prev,
        replying: { ...prev.replying, [threadId]: true }
      }));
      
      await axios.post(`http://localhost:5000/api/threads/${threadId}/replies`, { content });
      setReplyContent(prev => ({ ...prev, [threadId]: "" }));
      setReplyError(prev => ({ ...prev, [threadId]: "" }));
      
      // Fetch the updated replies
      await fetchReplies(threadId);
      
      setOperations(prev => ({
        ...prev,
        replying: { ...prev.replying, [threadId]: false }
      }));
    } catch (err) {
      console.error("Error posting reply:", err);
      setReplyError(prev => ({ ...prev, [threadId]: "Failed to post reply. Please try again." }));
      
      setOperations(prev => ({
        ...prev,
        replying: { ...prev.replying, [threadId]: false }
      }));
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center my-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary">Loading discussions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex flex-column align-items-center my-4" role="alert">
        <p>{error}</p>
        <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="card text-center my-5">
        <div className="card-body">
          <h3 className="card-title">No discussions yet</h3>
          <p className="card-text">Be the first to start a discussion!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="mb-4">
        <h2>Recent Discussions</h2>
        <hr />
      </div>
      <div className="row g-3">
        <AnimatePresence>
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              className="col-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div
                className={`card shadow-sm ${selectedThread === thread.id ? 'border-primary' : ''}`}
                onClick={() => handleThreadClick(thread.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  {editingThread === thread.id ? (
                    <>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <textarea
                          className="form-control mb-2"
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          rows={4}
                          placeholder="Content"
                        />
                        {editError && <div className="alert alert-danger py-1">{editError}</div>}
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={e => { e.stopPropagation(); handleEditSave(thread.id); }}
                          disabled={operations.updating[thread.id]}
                        >
                          {operations.updating[thread.id] ? 
                            <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Saving...</> :
                            'Save'
                          }
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={e => { e.stopPropagation(); handleEditCancel(); }}
                          disabled={operations.updating[thread.id]}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0">{thread.title}</h5>
                        <div className="text-muted small">
                          {formatDate(thread.created_at)}
                        </div>
                      </div>
                      <div className="mb-2 text-secondary">{thread.author || "Anonymous"}</div>
                      <p className="card-text">{thread.content}</p>
                      <div className="d-flex align-items-center gap-3">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={e => { e.stopPropagation(); setSelectedThread(thread.id); fetchReplies(thread.id); }}
                        >
                          Reply
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={e => { e.stopPropagation(); handleEdit(thread); }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={e => { e.stopPropagation(); handleDelete(thread.id); }}
                          disabled={operations.deleting[thread.id]}
                        >
                          {operations.deleting[thread.id] ? 
                            <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Deleting...</> :
                            'Delete'
                          }
                        </button>
                        <div className="ms-auto d-flex align-items-center">
                          <label className={`me-2 ${userVotes[thread.id] === 'like' ? 'fw-bold text-success' : ''}`}>
                            <input
                              type="radio"
                              className="form-check-input me-1"
                              name={`vote-${thread.id}`}
                              checked={userVotes[thread.id] === 'like'}
                              onChange={() => handleVote(thread.id, true)}
                            />
                            👍 Like
                          </label>
                          <span className="mx-2 text-primary fw-bold">{thread.likeCount}</span>
                          <label className={`ms-2 ${userVotes[thread.id] === 'dislike' ? 'fw-bold text-danger' : ''}`}>
                            <input
                              type="radio"
                              className="form-check-input me-1"
                              name={`vote-${thread.id}`}
                              checked={userVotes[thread.id] === 'dislike'}
                              onChange={() => handleVote(thread.id, false)}
                            />
                            👎 Dislike
                          </label>
                        </div>
                      </div>
                      {/* Replies Section */}
                      {selectedThread === thread.id && (
                        <div className="mt-4">
                          <h6>Replies</h6>
                          {operations.replying[thread.id] && (
                            <div className="text-center my-3">
                              <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading replies...</span>
                              </div>
                              <p className="text-muted small mt-1">Loading replies...</p>
                            </div>
                          )}
                          
                          {!operations.replying[thread.id] && (!replies[thread.id] || replies[thread.id].length === 0) && (
                            <p className="text-muted">No replies yet. Be the first to reply!</p>
                          )}
                          
                          {!operations.replying[thread.id] && replies[thread.id] && replies[thread.id].map((reply, i) => (
                            <div key={reply.id || i} className="mb-2 ps-3 border-start border-2">
                              <div className="text-muted small">{formatDate(reply.created_at)}</div>
                              <div>{reply.content}</div>
                            </div>
                          ))}
                          
                          <div className="mt-2">
                            <textarea
                              className="form-control mb-1"
                              rows={2}
                              placeholder="Write a reply..."
                              value={replyContent[thread.id] || ""}
                              onChange={e => handleReplyChange(thread.id, e.target.value)}
                              onClick={e => e.stopPropagation()}
                            />
                            {replyError[thread.id] && (
                              <div className="alert alert-danger py-1">{replyError[thread.id]}</div>
                            )}
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={e => { e.stopPropagation(); handleReplySubmit(thread.id); }}
                              disabled={operations.replying[thread.id]}
                            >
                              {operations.replying[thread.id] ? 
                                <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Sending...</> :
                                'Send Reply'
                              }
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ThreadsList;