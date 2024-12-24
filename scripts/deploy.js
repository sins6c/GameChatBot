async function main() {
    // Get the contract factory for ChatBot
    const ChatBot = await ethers.getContractFactory("ChatBot");
  
    // Deploy the contract
    console.log("Deploying ChatBot contract...");
    const chatBot = await ChatBot.deploy(); // Deploy the contract to the blockchain
  
    // Wait for the contract to be mined
    await chatBot.deployed();
  
    // Print the deployed contract address
    console.log("ChatBot deployed to:", chatBot.address);
  }
  
  // Run the main function and handle errors
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  