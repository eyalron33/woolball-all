import { useState, useEffect } from "react";
import { registerHuman } from "../utils/registerHuman";
import { verifyHuman } from "../utils/verifyHuman";
import Link from "next/link";
import Metamask from "../component/metamask";
import Footer from "../component/footer"
import Crowd from "../component/crowd"


const Index = () => {
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
    verifierAddress: "",
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
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const handleRegisterHuman = async () => {
    registerHuman(registerData)
  };

  const handleVerifyHuman = async () => {
    console.log("Verifying name with data:", verifyData);
    verifyHuman(verifyData)
  };


  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="fren-nav d-flex">
        <div>
          <h3>Don't press me I'm not a link</h3>
        </div>
        <div className="d-flex" style={{ marginLeft: "auto" }}>
          <div>
            <button className="btn connect-btn" onClick={connectWeb3}>
              {client.isConnected ? (
                <>
                  {client.address.slice(0, 4)}...
                  {client.address.slice(38, 42)}
                </>
              ) : (
                <>Connect Wallet</>
              )}
            </button>
          </div>
          <div>
            <Link href="https://mastodon.social/@neiman">
              <button className="btn md-btn">Mastodon</button>
            </Link>
          </div>
        </div>
      </nav>
      {/* Navbar end */}

      <section className="container d-flex">
        <main>
          <h1 className="main-title">Woolball  <img src="/giant-hash-sign.png" alt="Rocket" className="hashtag-image-title" /></h1>

          <p className="main-desc">Woolball Test Web App</p>

          {!haveMetamask ? (
            <Metamask />
          ) : client.isConnected ? (
            <>
              <br />
              <h2>You're connected ✅</h2>

              {/* Registration Column */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
                <h3>Register Name</h3>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    style={{
                      display: "block",
                      width: "50%",
                      marginBottom: "0.5rem",
                    }}
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
                    style={{
                      display: "block",
                      width: "50%",
                      marginBottom: "0.5rem",
                    }}
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
                    style={{
                      display: "block",
                      width: "50%",
                      marginBottom: "0.5rem",
                    }}
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
                    style={{
                      display: "block",
                      width: "50%",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <button className="btn connect-btn" onClick={handleRegisterHuman}>
                    Register Name
                  </button>
                </div>
              </div>

              {/* Verification Column */}
              <div style={{ flex: 1 }}>
                <h3>Verify Name</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={verifyData.name}
                  onChange={(e) =>
                    setRegisterData({ ...verifyData, name: e.target.value })
                  }
                  style={{
                    display: "block",
                    width: "50%",
                    marginBottom: "0.5rem",
                  }}
                />
                <div style={{ marginBottom: "1rem" }}>
                  <textarea
                    placeholder="Proof"
                    value={verifyData.proof}
                    onChange={(e) =>
                      setVerifyData({ ...verifyData, proof: e.target.value })
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      height: "150px", // Adjust height for visibility
                      resize: "vertical", // Allow vertical resizing if needed
                      marginBottom: "0.5rem",
                      padding: "0.5rem",
                      fontSize: "1rem",
                      fontFamily: "monospace", // Optional: makes proof more readable
                    }}
                  />
                </div>
                <button className="btn connect-btn" onClick={handleVerifyHuman}>
                  Verify Name
                </button>
              </div>

            </>
          ) : (
            <>
              <br />
              <button className="btn connect-btn" onClick={connectWeb3}>
                Connect Wallet
              </button>
            </>
          )}
        </main>
        <p>
        </p>
        <Crowd />
      </section >
      <Footer />
    </>
  );
};

export default Index;
