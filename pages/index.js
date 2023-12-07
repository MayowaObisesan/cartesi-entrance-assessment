import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
// import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import atm_abi from "./abi.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState([]);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [age, setAge] = useState(undefined);
  const [name, setName] = useState(undefined);
  const ageInput = useRef(null);
  const nameInput = useRef(null);

  const contractAddress = "0x67B46A7b07168305F856a25A7Bb02da75d5CEcf5";
  const atmABI = atm_abi.abi;

  const shortenAddress = (addr) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
  };

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getAge = async () => {
    if (atm) {
      setAge((await atm.getAge()).toNumber());
    }
  }

  const fetchName = async () => {
    console.log(atm);
    if (atm) {
      console.log(await atm.getName());
      setName((await atm?.getName()));
    }
  }

  const addAge = async (_age) => {
    if (atm) {
      let tx = await atm.setAge(_age);
      await tx.wait()
      getAge();
    }
  }

  const addName = async (_name) => {
    if (atm) {
      let tx = await atm.setName(_name);
      await tx.wait()
      fetchName();
    }
  }

  const initUser = () => {
    useEffect(() => {
      if (atm) {
        fetchName();
        getAge();
      }
    }, []);

    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p className="text-3xl font-bold">Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (account?.length < 1) {
      return (
        <section className="not-connected-container">
          <div>Kindly connect your wallet to see your Profile</div>
          <button onClick={connectAccount}>Please connect your Metamask wallet</button>
          <style jsx>{`
        *{
          font-family: system-ui, "sans-serif";
        }
        .not-connected-container {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          height: 80vh;
          width: 100%;
        }
        .not-connected-container div {
          font-size: 24px;
        }
        .not-connected-container button {
          border-radius: 8px;
          display: flex;
          height: 48px;
          line-height: 48px;
          border: 0px;
          background: dodgerblue;
          color: white;
          cursor: pointer;
          padding: 0 1.6em;
          margin: 1.6rem 0;
        }
        `}
          </style>
        </section>
      )
    }

    return (
      <section className="form-container">
        <div className="profile-details">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Daisy"
            alt="avatar"
            className=""
          />
          <h2>Hi {name}</h2>
          <div>Here's your profile card</div>
          <ul className="">
            <li>Wallet address: <span>{account}</span></li>
            <li>Age: <span>{age || "-"} years old</span></li>
          </ul>

        </div>
        <div className="form-control-container">
          <header>Update your profile here</header>
          <div className="form-control">
            <label htmlFor="id-name-input">
              Your name:
            </label>
            <div>
              <input id="id-name-input" type="text" placeholder="Enter your new Name" ref={nameInput} />
              <button className="" onClick={() => addName(nameInput.current.value)}>Update Name</button>
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="id-age-input">
              Your new age:
            </label>
            <div>
              <input id="id-age-input" type="number" placeholder="Set your new age" min={4} max={250} ref={ageInput} />
              <button onClick={() => addAge(ageInput.current.value)}>Update Age</button>
            </div>
          </div>
        </div>
        <style jsx>{`
        *{
          font-family: system-ui, "sans-serif";
        }
        .form-container {
          display: flex;
          flex-flow: row nowrap;
          justify-items: center;
          align-items: center;
          gap: 0 40px;
          width: 80%;
          margin: 2em auto;
        }
        .form-container p {
          font-weight: bold;
        }
        .profile-details {
          width: 48%;
          padding: 12em 5em 8em 5em;
          border-radius: 8px;
          box-shadow: 0px 2px 8px 0px lightgray;
        }
        .profile-details img {
          border-radius: 50%;
          display: block;
          margin: 0 auto;
          width: 160px;
          height: 160px;
          background: navajowhite;
        }
        .profile-details div {
          display: block;
          border-radius: 8px;
          text-align: center;
          padding: 4px 8px;
          width: auto;
          font-size: small;
          color: darkgray;
        }
        .profile-details h2 {
          display: block;
          text-align: center;
          margin: 40px auto;
        }
        .profile-details p {
          display: block;
          width: 100%;
        }
        .profile-details ul {
          list-style-type: none;
          padding: 0;
        }
        .profile-details ul li {
          padding: .8em 0 .8em 0;
          word-break: break-word;
        }
        .profile-details ul li span {
          display: block;
          line-height: 48px;
          font-weight: bold;
        }
        .form-control-container {
          border-radius: 16px;
          background: whitesmoke;
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          height: 800px;
          width: 100%;
        }
        .form-control-container header {
          font-size: 32px;
        }
        .form-control {
          // width: 400px;
          display: flex;
          flex-flow: column nowrap;
          margin: 2rem auto;
        }
        .form-control label {
          text-align: left;
          line-height: 40px;
        }
        .form-control > div {
          display: flex;
          width: 100%;
        }
        .form-control input {
          border: 1px solid darkgray;
          border-radius: 8px 8px;
          padding: .8rem .8rem;
          flex-grow: 1;
          width: 280px;
        }
        .form-control input:focus {
          outline: 1px solid deepskyblue;
          outline-offset: 2px;
        }
        .form-control button {
          line-height: 40px;
          border-radius: 8px 8px;
          background: dodgerblue;
          color: white;
          border: 0;
          outline: 2px solid;
          outline-offset: 2px;
          margin: 8px .4rem;
          width: 200px;
          max-width: 200px;
          padding: 0 2rem;
          cursor: pointer;
          font-weight: bold;
        }
      `}
        </style>
      </section>
    )
  }

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <nav className="navbar">
        <h1 className="text-3xl font-bold">Profile Creator</h1>
        <div className="connection-status">
          {
            account?.length > 0 ?
              <div>
                Connected - {""}
                <span>{account && shortenAddress(account[0])}</span>
              </div>
              : <div>Not Connected</div>
          }
        </div>
      </nav>
      {initUser()}
      <style jsx>{`
        * {
          font-family: system-ui;
          box-sizing: border-box;
        }
        .container {
          position: relative;
          width: 100%;
          margin: 0px auto;
        }
        .container header {
          text-align: center
        }
        .container .navbar {
          position: relative;
          height: 80px;
          line-height: 80px;
          padding: 0 40px;
          border-radius: 8px;
          z-index: 100;
        }
        .container .connection-status {
          position: absolute;
          top: 0;
          right: 16px;
        }
      `}
      </style>
    </main>
  )
}
