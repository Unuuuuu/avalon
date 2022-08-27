import Layout from "components/Layout";
import { socket, SocketContext } from "context/socket";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilSnapshot } from "recoil";
import "../styles/index.scss";

const RecoilDebugObserver = () => {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug("Atom values:");
    for (const node of snapshot.getNodes_UNSTABLE()) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
};

const App = ({ Component, pageProps }: AppProps) => {
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    const initializeSocket = async () => {
      await fetch("/api/socket");
    };

    initializeSocket();
    setIsInitial(false);
  }, []);

  if (isInitial) {
    return null;
  }

  return (
    <RecoilRoot>
      <RecoilDebugObserver />
      <SocketContext.Provider value={socket}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SocketContext.Provider>
    </RecoilRoot>
  );
};

export default App;
