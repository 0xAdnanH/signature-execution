// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CallBySignature {
    uint256 public count;
    uint256 public nonce;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function incrementCallNumber(bytes memory signature) public {
        bytes32 hash = ECDSA.toEthSignedMessageHash(
            abi.encodePacked(
                "iwantToincrement",
                nonce,
                address(this),
                block.chainid
            )
        );
        address addressRecovered = ECDSA.recover(hash, signature);
        require(addressRecovered == owner, "address recovered not the owner");
        count++;
        nonce++;
    }
}
