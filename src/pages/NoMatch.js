import { Link } from 'react-router-dom';
import ErrorMessage from '../components/errorMessage/ErrorMessage';

const NoMatch = () => {
  return (
    <div style={{ margin: '12rem 0' }}>
      <ErrorMessage />
      <p
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '24px',
          marginTop: '50px',
        }}
      >
        Page doesn't exist
      </p>
      <p
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '24px',
          marginTop: '30px',
        }}
      >
        <Link to="/">Back to main page</Link>
      </p>
    </div>
  );
};

export default NoMatch;
