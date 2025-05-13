import React, { useState, useEffect } from "react";
import Web3 from "web3";
import HelloWorldContract from "./HelloWorld.json"; // Ensure this path is correct
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [storedName, setStoredName] = useState("");
  const [newName, setNewName] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          const networkId = Number(await web3Instance.eth.net.getId());
          console.log("Detected Network ID:", networkId);

          const deployedNetwork = HelloWorldContract.networks[networkId];
          console.log("Deployed Contract Info:", deployedNetwork);

          if (deployedNetwork && deployedNetwork.address) {
            const contractInstance = new web3Instance.eth.Contract(
              HelloWorldContract.abi,
              deployedNetwork.address
            );
            setContract(contractInstance);
            console.log("Contract Instance:", contractInstance);
          } else {
            console.error(`Contract not deployed on network ID: ${networkId}`);
          }
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask not detected.");
      }
    };

    initWeb3();
  }, []);

  const handleSetName = async () => {
    if (!contract || !account) {
      console.error("Contract instance or account not found.");
      return;
    }
    try {
      await contract.methods
        .setName(newName)
        .send({ from: account, gas: 3000000 });
      setNewName("");
      handleGetName(); // Fetch updated name immediately
    } catch (error) {
      console.error("Error setting name:", error);
    }
  };

  const handleGetName = async () => {
    if (!contract) {
      console.error("Contract instance not found.");
      return;
    }
    try {
      const name = await contract.methods.getName().call();
      setStoredName(name);
    } catch (error) {
      console.error("Error getting name:", error);
    }
  };
 
  const handleClearTextBox = () => {
    setNewName("");
  }
 

  return (
    <>
      <h1>Blockchain Message Board</h1>
    <div className="App">
      <p>Current Message: {storedName?storedName:"Loading..."}</p>
      <div className="message">
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Enter new message"
        className="box"
      />
        <button onClick={handleSetName}>Update Message</button>
      </div>
        <button onClick={handleClearTextBox}>Refresh</button>
    </div>
    </>
  );
}

export default App;
