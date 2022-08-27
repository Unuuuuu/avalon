import { EVENT } from "constants/event.enum";
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface Member {
  nickname: string;
  socketId: string;
}

interface Room {
  roomId: string;
  roomName: string;
  totalNumber: string;
  members: Member[];
}

const rooms: Room[] = [];

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  // @ts-ignore
  if (res.socket.server.io) {
    console.log("🏃 Socket is already running");
  } else {
    console.log("🚀 Socket is initializing");
    // @ts-ignore
    const io = new Server(res.socket.server);
    // @ts-ignore
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      const socketId = socket.id;
      console.log("✅ Socket is connected");
      console.log(`Sockets: ${Array.from(await io.allSockets()).join(", ")}`);

      socket.on("disconnect", (reason) => {
        console.log("❎ Socket is disconnected");
        console.log(`Reason: ${reason}`);
      });

      socket.on(EVENT.GET_ROOMS, () => {
        console.log("get rooms");
        socket.emit(EVENT.ROOMS, rooms);
      });

      socket.on(EVENT.CREATE_ROOM, (data, nickname) => {
        console.log("create room");
        const roomId = uuidv4();
        rooms.push({ ...data, roomId, members: [{ nickname, socketId }] });
        socket.join(roomId);
        socket.broadcast.emit(EVENT.ROOMS, rooms);
        socket.emit(EVENT.ROOM_ID, roomId);
      });

      socket.on(EVENT.JOIN_ROOM, (roomId, nickname) => {
        console.log("join room");
        const foundRoom = rooms.find((room) => room.roomId === roomId);
        if (foundRoom) {
          const { members } = foundRoom;
          const foundMember = members.find((member) => member.socketId === socketId);

          if (foundMember) {
            foundMember.nickname = nickname;
          } else {
            foundRoom.members.push({ nickname, socketId });
            socket.join(roomId);
          }
          io.to(roomId).emit(EVENT.ROOM_UPDATE, foundRoom);
          socket.emit(EVENT.ROOM_ID, roomId);
        }
      });

      socket.on(EVENT.GET_ROOM_INFO, (roomId) => {
        console.log("get room info");
        const foundRoom = rooms.find((room) => room.roomId === roomId);
        if (foundRoom) {
          socket.emit(EVENT.ROOM_UPDATE, foundRoom);
        }
      });
    });
  }
  res.end();
}
