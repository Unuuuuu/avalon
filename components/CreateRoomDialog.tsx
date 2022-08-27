import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { EVENT } from "constants/event.enum";
import { SocketContext } from "context/socket";
import { useRouter } from "next/router";
import React, { Fragment, useContext, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { nicknameState } from "recoil/atoms";

interface CreateRoomDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
}

interface Data {
  roomName: string;
  totalNumber: string;
  // goodNumber: string;
  // evilNumber: string;
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = (props) => {
  const { onClose, open } = props;
  const nickname = useRecoilValue(nicknameState);
  const router = useRouter();
  const socket = useContext(SocketContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>();

  const onSubmit: SubmitHandler<Data> = (data) => {
    socket.emit(EVENT.CREATE_ROOM, data, nickname);
  };

  useEffect(() => {}, [socket, router]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full h-full max-w-lg rounded bg-neutral-700 p-4 overflow-y-scroll">
              <div className="flex justify-end">
                <XMarkIcon className="w-6 h-6 p-1 box-content cursor-pointer" onClick={() => onClose(false)} />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <label>
                  <span>방 이름</span>
                  <input type="text" {...register("roomName", { required: true })} />
                  {errors.roomName && <div role={"alert"}>방 이름은 필수입니다.</div>}
                </label>
                <label>
                  <span>총 인원</span>
                  <input type="number" min={0} {...register("totalNumber", { required: true })} />
                  {errors.totalNumber && <div role={"alert"}>총 인원은 필수입니다.</div>}
                </label>
                <button className="primary mt-2" type="submit">
                  방 만들기
                </button>
              </form>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default CreateRoomDialog;
