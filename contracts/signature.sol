// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title CallBySignature
 * @dev A contract that allows the owner to increment a call number by verifying a signature.
 */
contract CallBySignature {
    uint256 public count;
    uint256 public nonce;
    address public owner;

    /**
     * @dev Contract constructor
     * @param _owner The address of the contract owner
     */
    constructor(address _owner) {
        owner = _owner;
    }

    /**
     * @dev Increment the call number by verifying the provided signature.
     * @param signature The signature to be verified
     */
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
