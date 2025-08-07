import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const StarredRepos = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRepos = async (pageNumber) => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}?q=created:>${API_CONFIG.REFERENCE_DATE}&sort=stars&order=desc&page=${pageNumber}&per_page=${API_CONFIG.PER_PAGE}`
      );

      if (pageNumber === 1) {
        setRepositories(response.data.items);
      } else {
        setRepositories((prev) => [...prev, ...response.data.items]);
      }

      setHasMore(response.data.items.length === API_CONFIG.PER_PAGE);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    fetchRepos(page);
  }, [page]);

  if (loading && page === 1) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Trending Repos</h1>
        </div>
      </header>
      
      <div className="repos-container">
        <div className="repos-list">
          {repositories.map((repo) => (
            <div key={repo.id} className="repo-item">
              <div className="repo-content">
                <div className="repo-title">
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login}'s avatar`}
                    className="avatar"
                  />
                  <div>
                    <h3>{repo.name}</h3>
                    <span className="owner-name">{repo.owner.login}</span>
                  </div>
                </div>
                <p className="description">
                  {repo.description || 'No description available'}
                </p>
                <div className="repo-stats">
                  <span className="stars">⭐ {repo.stargazers_count.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && <div className="loading">Loading...</div>}

        <div className="footer-tabs">
          <a href="#trending" className="tab active">
            <span className="tab-icon">⭐</span>
            <span>Trending</span>
          </a>
          <a href="#settings" className="tab">
            <span className="tab-icon">⚙️</span>
            <span>Settings</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default StarredRepos;