import { Popover } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { usePopper } from "react-popper";
import { useRecoilValue } from "recoil";
import { nicknameState } from "recoil/atoms";

const Header = () => {
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const nickname = useRecoilValue(nicknameState);
  const router = useRouter();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <header className="flex justify-between items-center py-4">
      <h1 className="text-4xl font-bold pointer-events-none">Avalon</h1>
      <Popover>
        {nickname && (
          <Popover.Button
            ref={setReferenceElement}
            className="gap-1 primary profile text-sm"
            disabled={router.pathname === "/"}
          >
            <UserCircleIcon className="w-5 h-5 text-neutral-300" />
            <span>{nickname}</span>
          </Popover.Button>
        )}
        <Popover.Panel ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          {({ close }) => (
            <Link href="/">
              <button
                className="primary text-sm"
                onClick={() => {
                  close();
                }}
              >
                닉네임 변경하기
              </button>
            </Link>
          )}
        </Popover.Panel>
      </Popover>
    </header>
  );
};

export default Header;
