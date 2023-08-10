# Signature Execution

The Signature Execution project showcases an owned contract featuring a specific function that can be invoked by anyone, provided they validate their action with the owner's signature.

In contrast to traditional methods relying on `msg.sender` checks, this project implements a more flexible approach involving signature verification. Any relayer can submit the transaction and validate the owner's intention through ECDSA signatures, enabling users to perform actions without needing the native token for gas fees.

## Goals of the Project

The project's main objectives are to:

- **Highlight Signature Validation:** Demonstrate the effectiveness of signature-based validation over the typical `msg.sender` checks. This approach empowers any user or relayer to submit transactions on behalf of the contract owner.

- **Emphasize Security Measures for Signatures:** Address the security considerations necessary when employing signatures. Signatures are vulnerable to attacks such as replays and malleability. The project underscores the importance of implementing security checks to mitigate these risks effectively.

## Technicalities of the Project

- **Use of EIP191 with Version `0x45`:** The project employs the [EIP191](https://eips.ethereum.org/EIPS/eip-191) standard with version `0x45` (toEthSignedMessage) to prepare the encoded message before generating the signature. This approach is a recommended practice within the Ethereum ecosystem.

- **Utilization of ECDSA Library from OpenZeppelin:** The OpenZeppelin library's ECDSA component is imported to facilitate the recovery of the signer's address from the signature and encoded message.

- **Signing Utilities with ethers.js:** The project integrates signing utilities provided by `ethers.js`, such as message serialization and signing, to streamline the signature generation process.

- **Inclusion of Security Checks in the Message:** The message to be signed incorporates the following components for enhanced security:

    - Nonce: Prevents seamless replay attacks by disallowing the reuse of signed messages.
    - `address(this)`: Specifies the contract's address, ensuring the signed message is specific to 1 contract instead of having it works with all contracts owned by the same owner.
    - Chain ID: Guards against replay attacks across multiple chains, ensuring that signed messages are not replayed on different networks.

**Note:** This project emphasizes the advantages of signature-based validation and highlights essential security precautions. It is designed for educational purposes and aims to enhance understanding of secure transaction execution in a decentralized environment.


## Installation

### cloning the repository

Alternatively you can clone the repository and install its dependencies to start using the smart contracts.

```bash
$ git clone https://github.com/0xAdnanH/signature-execution.git
$ cd ./signature-execution
$ npm install
```

### Instructions

#### Compile

To Compile the contract run:

```bash
$ npx hardhat compile
```

#### Tests

To run the unit tests:

```bash
$ npx hardhat test
```
