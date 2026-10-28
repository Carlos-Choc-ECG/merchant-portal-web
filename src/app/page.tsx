import { redirect } from 'next/navigation';

export default function Home() {
  // Temporarily redirect to the login page for now.
  // This will eventually redirect to the dashboard once the user is authenticated.
  redirect('/login');
}
