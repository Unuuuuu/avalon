import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { nicknameState } from "recoil/atoms";

interface Data {
  nickname: string;
}

const Home = () => {
  const [nickname, setNickname] = useRecoilState(nicknameState);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>();

  const onSubmit: SubmitHandler<Data> = (data) => {
    const { nickname } = data;
    setNickname(nickname);
    router.push("/lobby");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <label>
          <span>닉네임</span>
          <input type="text" {...register("nickname", { required: true })} />
          {errors.nickname && <div role={"alert"}>닉네임은 필수입니다.</div>}
        </label>
        <button className="primary mt-2" type="submit">
          {nickname ? "변경하기" : "입력하기"}
        </button>
      </form>
      {nickname && (
        <Link href="/lobby">
          <button className="mt-4">기존 닉네임으로 입장하기</button>
        </Link>
      )}
    </>
  );
};

export default Home;
