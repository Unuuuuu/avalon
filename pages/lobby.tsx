import CreateRoomDialog from "components/CreateRoomDialog";
import { EVENT } from "constants/event.enum";
import { SocketContext } from "context/socket";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { nicknameState } from "recoil/atoms";

interface Room {
  roomId: string;
  roomName: string;
  totalNumber: string;
  members: any[];
}

const Lobby = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isCreateRoomDialogOpened, setIsCreateRoomDialogOpened] = useState(false);
  const nickname = useRecoilValue(nicknameState);
  const router = useRouter();
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (nickname === null) {
      router.push("/");
    }
  }, [nickname, router]);

  useEffect(() => {
    socket.emit(EVENT.GET_ROOMS);

    socket.on(EVENT.ROOMS, (data) => {
      setRooms(data);
    });

    socket.on(EVENT.ROOM_ID, (roomId) => {
      router.push(`/room/${roomId}`);
    });

    return () => {
      socket.off(EVENT.ROOMS, (data) => {
        setRooms(data);
      });

      socket.off(EVENT.ROOM_ID, (roomId) => {
        router.push(`/room/${roomId}`);
      });
    };
  }, [socket, router]);

  const handleCreateRoomButtonClick = () => {
    setIsCreateRoomDialogOpened(true);
  };

  const handleCreateRoomDialogClose = () => {
    setIsCreateRoomDialogOpened(false);
  };

  return (
    <>
      <div className="text-gray-300 mb-1">방 목록</div>
      {rooms.length === 0 && <div className="mt-4 mb-2">방이 없습니다.</div>}
      {rooms.length !== 0 &&
        rooms.map((room) => {
          const { roomId, roomName, members, totalNumber } = room;
          return (
            <div
              key={roomId}
              className="bg-neutral-700 rounded-sm p-2 mb-2"
              onClick={() => {
                socket.emit(EVENT.JOIN_ROOM, roomId, nickname);
              }}
            >
              <span>{roomName}</span>
              <span>{`${members.length}/${Number(totalNumber)}`}</span>
            </div>
          );
        })}
      <button type="button" className="primary" onClick={handleCreateRoomButtonClick}>
        방 만들기
      </button>
      <CreateRoomDialog open={isCreateRoomDialogOpened} onClose={handleCreateRoomDialogClose} />
    </>
  );
};

export default Lobby;
