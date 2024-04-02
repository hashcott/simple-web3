import { useState } from "react";
import "./App.css";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

import contractAddress from "./contract/address.json";

import HighLow from "./contract/HighLow.json";

function App() {
    const [address, setAddress] = useState(undefined);
    const [chainId, setChainId] = useState(undefined);
    const [balance, setBalance] = useState(undefined);
    const [contract, setContract] = useState(null);

    const [soTienNap, setSoTienNap] = useState(0);
    const [soMayMan, setSoMayMan] = useState(0);
    const [soTienCuoc, setSoTienCuoc] = useState(0);

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

        // connect to the contract
        const contract = new Contract(
            contractAddress.address,
            HighLow.abi,
            signer
        );
        setContract(contract);

        const balance = await contract.accounts(_address);
        console.log(balance);
        setBalance(balance);

        contract.on("Win", async (isWin, winner) => {
            // gui thong bao tat nguoi choi
            if (winner === _address) {
                alert(
                    `Bạn ${winner} ${isWin ? "thắng" : "thua"} số tiền ${
                        parseFloat(soTienCuoc) * 2
                    }`
                );
                const balance = await contract.accounts(_address);
                setBalance(balance);
            }
        });
    };

    const napTien = async () => {
        await contract.napTien({ value: parseEther(soTienNap) });
    };

    const play = async () => {
        await contract.highLow(soMayMan, parseEther(soTienCuoc));
    };

    return (
        <div className="App">
            <header className="App-header">
                <p style={{ display: address ? "block" : "none" }}>
                    <code>{address && address}</code>
                </p>
                <p style={{ display: chainId ? "block" : "none" }}>
                    <code>ChainId: {chainId && chainId.toString()}</code>
                </p>
                <p style={{ display: chainId ? "block" : "none" }}>
                    <code>
                        Balance: {balance ? formatEther(balance).toString() : 0}{" "}
                        ETH
                    </code>
                </p>

                <div style={{ display: contract ? "block" : "none" }}>
                    <input
                        onChange={(e) => setSoTienNap(e.target.value)}
                        type="number"
                    />
                    <button onClick={napTien}>Nạp tiền</button>
                </div>

                <div style={{ display: contract ? "block" : "none" }}>
                    <input
                        onChange={(e) => setSoMayMan(e.target.value)}
                        type="number"
                        placeholder="số may mắn"
                    />
                    <input
                        onChange={(e) => setSoTienCuoc(e.target.value)}
                        type="number"
                        placeholder="số tiền cược"
                    />
                    <button onClick={play}>Chơi game</button>
                </div>

                <button
                    onClick={connectWallet}
                    style={{
                        display: contract ? "none" : "block",
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
