"use client"
import { Auth, getUser } from '../auth';
import { useEffect, useState } from 'react';
import { getUserFragments } from '@/api';

export default function Home() {

  // State variable to keep track of login status
  const [loggedIn, setloggedIn] = useState(false);
  const [user, setUser] = useState({});
  // Handler for login button
  const handleLogin = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  }

  // Handler for logout button
  const handleLogout = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  }

  // Fetch user object and display user name on page
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();        

        if (!user) {
          setloggedIn(false);
        } else {
          setloggedIn(true);
          getUserFragments(user);
          setUser(user);
          console.log(user);
        }

      } catch (error) {
        setloggedIn(false)
        console.log(`Unable to Fetch user data due to ${error}`);
      }
    }

    // only fetch user data if user is not logged in
    if (!loggedIn) {
      fetchUser();
    }
  }, [loggedIn])


  return (
    <div className="items-center bg-blue-100">
      <div className='px-36 py-20'>
        <div className='mb-20 space space-y-10'>
          <div className='text-3xl font-bold'>Fragments UI</div>
          {loggedIn && <div className='text-xl font-medium'>Welcome {user.username}</div>}
        </div>
        <div className='justify-items-center space-x-40'>
          <button
            className='rounded-full justify-end bg-emerald-400 hover:bg-emerald-600 py-3 px-8 font-bold shadow-lg hover:shadow-md'
            onClick={handleLogin}
            disabled={loggedIn}
          >
            Login
          </button>
          <button
            className='rounded-full justify-end bg-red-600 hover:bg-red-700 py-3 px-8 font-bold shadow-lg hover:shadow-md'
            onClick={handleLogout}
            disabled={!loggedIn}
          >Logout
          </button>
        </div>
      </div>

    </div>
  )
}
