import { useState } from "react";
import "./App.css";
import { BrowserProvider, formatEther } from "ethers";
function App() {
    const [address, setAddress] = useState(undefined);
    const [chainId, setChainId] = useState(undefined);
    const [balance, setBalance] = useState(undefined);
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install Metamask");
            return;
        }
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // get the address of the connected account
        const _address = await signer.getAddress();
        setAddress(_address);

        const _chainId = await provider.getNetwork();
        if (_chainId.chainId !== 17000n) {
            alert("Please switch to the correct network");
            return;
        }
        setChainId(_chainId.chainId);

        // get balance
        const balance = await provider.getBalance(_address);
        setBalance(balance);
    };
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    <code>Connect to Metamask</code>
                </p>
                <p style={{ display: address ? "block" : "none" }}>
                    <code>{address && address}</code>
                </p>
                <p style={{ display: chainId ? "block" : "none" }}>
                    <code>ChainId: {chainId && chainId.toString()}</code>
                </p>
                <p style={{ display: chainId ? "block" : "none" }}>
                    <code>
                        Balance: {balance && formatEther(balance).toString()}{" "}
                        ETH
                    </code>
                </p>
                <button
                    onClick={connectWallet}
                    style={{
                        backgroundColor: "white",
                        color: "black",
                        padding: "20px 40px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "1.4rem",
                    }}
                >
                    Connect
                </button>
            </header>
        </div>
    );
}

export default App;
