import api from '../../services/api';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList,
} from './styles';

export default function Repo({ match }) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const nameRepo = decodeURIComponent(match.params.repo);

      const [repositoryData, issuesData] = await Promise.all([
        api.get(`/repos/${nameRepo}`),
        api.get(`/repos/${nameRepo}/issues`, {
          params: {
            state: 'open',
            per_page: 5,
          },
        }),
      ]);

      setRepository(repositoryData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }

    load();
  }, [match.params.repo]);

  useEffect(() => {
    async function loadIssue() {
      const nameRepo = decodeURIComponent(match.params.repo);

      const response = await api.get(`/repos/${nameRepo}/issues`, {
        params: {
          state: filter,
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    }

    loadIssue();
  }, [match.params.repo, filter, page]);

  function handlePage(action) {
    setPage(action === 'previous' ? page - 1 : page + 1);
  }

  function handleState(state) {
    if (state === 'open') {
      setFilter('open');
    } else if (state === 'closed') {
      setFilter('closed');
    } else {
      setFilter('all');
    }
  }

  if (loading) {
    return (
      <Loading>
        <h1>Loading...</h1>
      </Loading>
    );
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
        <h1>{repository.name}</h1>
        <p>{repository.description}</p>
      </Owner>

      <FilterList>
        <button type="button" onClick={() => handleState('all')}>
          All
        </button>
        <button type="button" onClick={() => handleState('open')}>
          Open
        </button>
        <button type="button" onClick={() => handleState('closed')}>
          Closed
        </button>
      </FilterList>

      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map((label) => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>

              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage('previous')}
          disabled={page < 2}
        >
          Previous
        </button>

        <button type="button" onClick={() => handlePage('next')}>
          Next
        </button>
      </PageActions>
    </Container>
  );
}
