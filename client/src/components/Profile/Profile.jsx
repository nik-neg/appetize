import { useState, useEffect } from 'react';
import ApiClient from '../../services/ApiClient';
import DropZone from '../DropZone/DropZone';

export default function Profile ({id}) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    ApiClient.getProfile(id)
    .then((data) => setUserData(data))
    }, []);

  return (
    <div>
      Hello {userData.firstName}
      <DropZone/>
    </div>
  );
}