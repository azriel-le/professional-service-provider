import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear user session
    localStorage.removeItem('user_id');
    // Redirect to login page
    router.push('/login');
  }, [router]);

  return <p>Logging out...</p>;
};

export default Logout;