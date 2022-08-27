import { EVENT } from "constants/event.enum";
import { SocketContext } from "context/socket";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Data {
  roomName: string;
  totalNumber: string;
  // goodNumber: string;
  // evilNumber: string;
}

const Create = () => {
  const socket = useContext(SocketContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>();

  const onSubmit: SubmitHandler<Data> = (data) => {
    socket.emit(EVENT.CREATE_ROOM, data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <label htmlFor="roomName">방 이름</label>
      <input id="roomName" className="rounded-sm p-1" {...register("roomName", { required: true })} />
      {errors.roomName && <div className="alert">방 이름은 필수입니다.</div>}
      <label htmlFor="totalNumber">총 인원</label>
      <input
        id="totalNumber"
        className="rounded-sm p-1"
        type="number"
        min={0}
        {...register("totalNumber", { required: true })}
      />
      {errors.totalNumber && <div className="alert">총 인원은 필수입니다.</div>}
      {/* <label htmlFor="goodNumber">착한 팀은 몇 명인가요?</label>
        <input id="goodNumber" type="number" min={0} {...register("goodNumber")} />
        <label htmlFor="evilNumber">악한 팀은 몇 명인가요?</label>
        <input id="evilNumber" type="number" min={0} {...register("evilNumber")} /> */}
      {/* <input {...register("exampleRequired", { required: true })} /> */}
      <button type="submit" className="bg-neutral-800 rounded-sm p-1">
        방 만들기
      </button>
    </form>
  );
};

export default Create;
