// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MessageDapp {
    string private message;

    // Function to set the message
    function setmessage(string memory newmessage) public {
        message = newmessage;
    }

    // Function to get the message
    function getmessage() public view returns (string memory) {
        return message;
    }
     // Function to get the message
   function clearmessage() public {
        message = "";
    }
}