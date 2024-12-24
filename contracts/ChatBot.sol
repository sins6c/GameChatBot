// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatBot {
    string public aiDecision;

    event AIDecisionUpdated(string oldDecision, string newDecision);

    function getAIDecision() public view returns (string memory) {
        return aiDecision;
    }

    function setAIDecision(string memory decision) public {
        string memory oldDecision = aiDecision;
        aiDecision = decision;
        emit AIDecisionUpdated(oldDecision, decision);
    }
}
