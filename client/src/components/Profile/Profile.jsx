import { useState, useEffect } from 'react';
import ApiClient from '../../services/ApiClient';

export default function Profile ({id}) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    ApiClient.getProfile(id)
    .then((data) => setUserData(data))
    }, []);

  return (
    <div>
      {userData.firstName}
    </div>
  );
}