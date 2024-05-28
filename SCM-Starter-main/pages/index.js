import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amountInput, setAmountInput] = useState(1);
  const [factorialResult, setFactorialResult] = useState(undefined);
  const [palindromeResult, setPalindromeResult] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(amountInput);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(amountInput);
      await tx.wait();
      getBalance();
    }
  };

  const calculateFactorial = () => {
    if (amountInput < 0) {
      setFactorialResult("Factorial is not defined for negative numbers");
      return;
    }

    let factorial = 1;
    for (let i = 2; i <= amountInput; i++) {
      factorial *= i;
    }

    setFactorialResult(`Factorial of ${amountInput} is: ${factorial}`);
  };

  const checkPalindrome = () => {
    const numberStr = String(amountInput);
    const reversedStr = numberStr.split("").reverse().join("");

    if (numberStr === reversedStr) {
      setPalindromeResult(`${amountInput} is a palindrome.`);
    } else {
      setPalindromeResult(`${amountInput} is not a palindrome.`);
    }
  };

  const displayMyInfo = () => {
    alert("Training : Chandigarh University\nRoll Number: 21BCS1234");
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p style={{ fontSize:'25px', textDecoration:'underline'}}>Your Account: {account}</p>
        <p style={{ fontSize:'20px', fontWeight:'bold'}}>Your Balance: {balance}</p>
        <div>
          <input
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
          <br></br>
          <br></br>
          <button style={{ backgroundColor: '#14c4b4', color: 'white',marginRight:'10px', fontSize: '20px' }}onClick={deposit}>Deposit</button>
          <button style={{ backgroundColor: 'orange', color: 'white' ,fontSize: '20px' }} onClick={withdraw}>Withdraw</button>
        </div>
        <div>
          <button style={{ backgroundColor: 'green', color: 'white' ,fontSize: '20px', marginTop:'5px' }} onClick={calculateFactorial}>Calculate Factorial</button>
          {factorialResult && <p>{factorialResult}</p>}
        </div>
      
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
      <header><h1 style={{ backgroundColor: '#fce4dc', color: '#2c3477'}}>SMART CONTRACT ATM!</h1></header>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center; border: 4px solid black; background-color: #587edf; padding: 30px;
        }
      `}</style>
    </main>
  );
}
