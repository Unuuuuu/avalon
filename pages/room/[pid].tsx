import { EVENT } from "constants/event.enum";
import { SocketContext } from "context/socket";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const Room = () => {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const { pid } = router.query;
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket.emit(EVENT.GET_ROOM_INFO, pid);

    socket.on(EVENT.ROOM_UPDATE, (room) => {
      setMembers(room.members);
    });

    return () => {
      socket.off(EVENT.ROOM_UPDATE, (room) => {
        setMembers(room.members);
      });
    };
  }, [socket, pid]);

  return (
    <>
      <p>Room: {pid}</p>
      {members.map((member, idx) => (
        <p key={idx}>{member.nickname}</p>
      ))}
    </>
  );
};

export default Room;
