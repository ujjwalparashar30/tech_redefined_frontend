import { useState } from 'react';
import RoomManagement from './RoomManagement';
import DrawingRoom from './DrawingRoom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Collaboration(){
    const { authUser } = useAuthStore();
    const [currentRoom, setCurrentRoom] = useState(null);
    const [ws, setWs] = useState(null);

  

  const handleJoinRoom = (roomId, socket) => {
    setCurrentRoom(roomId);
    setWs(socket);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    ws?.close();
    setWs(null);
  };

  return currentRoom ? (
    <div>
    <DrawingRoom
      roomId={currentRoom}
      ws={ws}
      onLeaveRoom={handleLeaveRoom}
      user = {authUser}
    />
    </div>
  ) : (
    <div className='flex justify-center items-center h-full mb-0!'>
    <RoomManagement onJoinRoom={handleJoinRoom} userId ={authUser._id} />
    
    </div>
  );
  
}