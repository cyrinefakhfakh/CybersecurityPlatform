import ProgressBar from '../components/ProgressBar';

function Profile() {
  const userProgress = 75; // Exemple de progression

  return (
    <div className="profile">
      <h2>Your Profile</h2>
      <p>Track your progress and earn certificates.</p>
      <ProgressBar progress={userProgress} />
    </div>
  );
}

export default Profile;
