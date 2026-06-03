import { useMemo } from 'react';
import { Avatar } from '@svar-ui/react-core';
import './AvatarCell.css';

export default function AvatarCell({ row, data, column }) {
  const userData = useMemo(() => {
    if (data) return data;
    const users = column.options;
    const options = row['assigned']?.map(id =>
      users.find(user => user.id === id)
    );
    if (options?.length === 1) {
      return options[0];
    }
    return options;
  }, [data, column, row]);

  const names = useMemo(() => {
    if (Array.isArray(userData) && userData.length) {
      return userData.map(user => user.name).join(', ');
    }
    return '';
  }, [userData]);

  return (
    <div className="wx-utjM0Tbo container">
      {Array.isArray(userData) ? (
        userData.length < 3 ? (
          names
        ) : (
          <Avatar value={userData} size={22} />
        )
      ) : (
        <>
          <Avatar value={userData} size={28} />
          <div className="wx-utjM0Tbo">{userData?.name ?? ''}</div>
        </>
      )}
    </div>
  );
}
