import { useState, useEffect, useRef } from "react";
import { registerHuman } from "../utils/registerHuman";
import { verifyHuman } from "../utils/verifyHuman";
import Link from "next/link";
import Metamask from "../component/metamask";
import Footer from "../component/footer"
import Crowd from "../component/crowd"


const Index = () => {
  const formWrapperRef = useRef(null)
  const [haveMetamask, sethaveMetamask] = useState(true);

  const [client, setclient] = useState({
    isConnected: false,
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    pubKeyX: "",
    pubKeyY: "",
    duration: "",
  });

  const [verifyData, setVerifyData] = useState({
    proof: "",
    name: "",
    verifiedForTimestamp: "",
  });


  const checkConnection = async () => {
    const { ethereum } = window;
    if (ethereum) {
      sethaveMetamask(true);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setclient({
          isConnected: true,
          address: accounts[0],
        });
      } else {
        setclient({
          isConnected: false,
        });
      }
    } else {
      sethaveMetamask(false);
    }
  };

  const connectWeb3 = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setclient({
        isConnected: true,
        address: accounts[0],
      });
      
      if (formWrapperRef?.current) {
        formWrapperRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const disconnectWeb3 = () => {
    setclient({
      isConnected: false,
    });
  };

  const handleRegisterHuman = async () => {
    registerHuman(registerData)
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryData = e.target.result;
      const hexData = Array.from(new Uint8Array(binaryData))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const sequences = [];
      for (let i = 0; i < 6; i++) {
        sequences.push(hexData.slice(i * 64, (i + 1) * 64));
      }

      setVerifyData({
        proof: hexData.slice(6 * 64),
        name: sequences[2],
        verifiedForTimestamp: sequences[3],
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleVerifyHuman = async () => {
    console.log("Verifying with data:", verifyData);
    verifyHuman(verifyData);
  };


  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="fren-nav d-flex">
        <div>
          <h3>Don't press me I'm not a link</h3>
        </div>
        <div className="d-flex" style={{ marginLeft: "auto" }}>
          <ConnectBtn
            address={client.address}
            onClick={client.isConnected ? disconnectWeb3 : connectWeb3}
          />
          <div>
            <Link href="https://mastodon.social/@neiman">
              <button className="btn md-btn">Mastodon</button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Navbar end */}

      <section className="main-section container d-flex">
      <div className="section-overlay"/>
      <Crowd />
        <main>
          <h1 className="main-title">Woolball  <img src="/giant-hash-sign.png" alt="Rocket" className="hashtag-image-title" /></h1>

          <p className="main-desc">Woolball Test Web App</p>

          {!haveMetamask ? (
            <Metamask />
            ) : (
            <ConnectBtn
              address={client.address}
              onClick={client.isConnected ? disconnectWeb3 : connectWeb3}
            />
          )}
        </main>
      </section >


        <div
          ref={formWrapperRef}
          className={`form-wrapper d-flex flex-column ${client.isConnected ? 'show' : 'hide'}`}
        >

        {/* Registration Column */}
        <form className="d-flex flex-column">
          <h3>Register Name</h3>
            <input
              type="text"
              placeholder="Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Public Key X Coordinate"
              value={registerData.pubKeyX}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  pubKeyX: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Public Key Y Coordinate"
              value={registerData.pubKeyY}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  pubKeyY: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Duration (in weeks)"
              value={registerData.duration}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  duration: e.target.value,
                })
              }
            />
            <button className="btn connect-btn" onClick={handleRegisterHuman}>
              Register Name
            </button>
        </form>

        {/* Verification Column */}
        <form className="d-flex flex-column">
          <h3>Verify Name</h3>
          <input
            type="text"
            placeholder="Name"
            value={verifyData.name}
            onChange={(e) =>
              setVerifyData({ ...verifyData, name: e.target.value })
            }
          />
            <input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              style={{ display: "block", marginBottom: "0.5rem" }}
            />
            <button className="btn connect-btn" onClick={handleVerifyHuman}>
              Verify Name
            </button>
        </form>

      </div>
      <Footer />
    </div>
  );
};

const ConnectBtn = ({ address, onClick }) => {
  return (
    <button className="btn connect-btn" onClick={onClick}>
      {address?.length ? (
        <>
          {address.slice(0, 4)}...
          {address.slice(38, 42)}
        </>
      ) : (
        <>Connect Wallet</>
      )}
    </button>
  )
}

export default Index;
