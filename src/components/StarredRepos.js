import { useState, useEffect } from "react";
import axios from "axios";
import { API_CONFIG } from "../config/config";

const StarredRepos = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRepos = async (pageNumber) => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}?q=created:>${API_CONFIG.REFERENCE_DATE}&sort=stars&order=desc&page=${pageNumber}&per_page=${API_CONFIG.PER_PAGE}`
      );

      setRepositories(response.data.items);
      setTotalPages(Math.ceil(response.data.total_count / API_CONFIG.PER_PAGE));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    const maxPageButtons = 5;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`page-button ${i === page ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageButtons.push(
            <button
              key={i}
              className={`page-button ${i === page ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        pageButtons.push(<span key="page">...</span>);
        pageButtons.push(
          <button
            key={totalPages}
            className={`page-button ${totalPages === page ? "active" : ""}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      } else if (page > totalPages - 3) {
        pageButtons.push(
          <button
            key={1}
            className={`page-button ${1 === page ? "active" : ""}`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        pageButtons.push(<span key="page">...</span>);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageButtons.push(
            <button
              key={i}
              className={`page-button ${i === page ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
      } else {
        pageButtons.push(
          <button
            key={1}
            className={`page-button ${1 === page ? "active" : ""}`}
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        );
        pageButtons.push(<span key="page-start">...</span>);
        for (let i = page - 1; i <= page + 1; i++) {
          pageButtons.push(
            <button
              key={i}
              className={`page-button ${i === page ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
        pageButtons.push(<span key="page-end">...</span>);
        pageButtons.push(
          <button
            key={totalPages}
            className={`page-button ${totalPages === page ? "active" : ""}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageButtons;
  };

  if (loading) {
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
                  {repo.description || "No description available"}
                </p>
                <div className="repo-stats">
                  <span className="stars">
                    ⭐ {repo.stargazers_count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            className="page-button prev-button"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Prev
          </button>
          {renderPageButtons()}
          <button
            className="page-button next-button"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>

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