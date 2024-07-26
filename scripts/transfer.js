const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0xae6add0690F91BeF07957E3AC7Bc7964D7E54e6a"; // Your contract address
  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("TestToken");
  const contract = contractFactory.attach(contractAddress);

  const functionName = "transfer";
  const functionArgs = ["0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1", "1"];
  const transaction = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, functionArgs),
    0
  );

  await transaction.wait();
  console.log("Transaction Response: https://explorer-evm.testnet.swisstronik.com/tx/" + transaction.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
