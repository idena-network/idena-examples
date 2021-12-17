// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./PbModels.sol";

contract IdenaHumanVoting {

    enum Status {OPEN, FINISHED}

    bytes32 rootHash;
    uint8 maxValue;
    uint startBlock;
    uint duration;

    Status status;
    mapping(address => bool) voters;
    mapping(uint8 => uint32) scores;
    uint8 winner;

    constructor(bytes32 _rootHash, uint8 _maxValue, uint _duration) {
        rootHash = _rootHash;
        maxValue = _maxValue;
        duration = _duration;
        status = Status.OPEN;
        startBlock = block.number;
    }

    function vote(bytes memory data, uint8 value, bytes memory signature) public {
        require(status == Status.OPEN, "voting already finished");
        require(value <= maxValue, "too high value");
        address _signatureAddress = signatureAddress(data, address(this), value, signature);
        require(!voters[_signatureAddress], "voter already voted");
        require(isHuman(rootHash, data, _signatureAddress), "voter is not human");
        voters[_signatureAddress] = true;
        scores[value]++;
    }

    function finish() public returns (uint8) {
        require(startBlock + duration < block.number, "too early to finish voting");
        require(status == Status.OPEN, "voting already finished");
        uint8 _winner;
        uint32 winnerScore;
        for (uint8 value = 0; value <= maxValue; value++) {
            uint32 score = scores[value];
            if (score > winnerScore) {
                winnerScore = score;
                _winner = value;
            }
        }
        winner = _winner;
        status = Status.FINISHED;
        return _winner;
    }

    function signatureAddress(bytes memory data, address votingAddress, uint8 value, bytes memory signature) private pure returns (address) {
        bytes32 h = keccak256(abi.encodePacked(data, votingAddress, value));
        h = keccak256(abi.encodePacked(h));
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        address signer = ecrecover(h, v + 27, r, s);
        return signer;
    }

    function isHuman(bytes32 root, bytes memory data, address identityAddress) private pure returns (bool) {
        PbModels.ValueWithProof memory valueWithProof;
        valueWithProof = PbModels.decValueWithProof(data);
        PbModels.ProofLeaf memory leaf = valueWithProof.leaf;
        if (identityAddress != extractAddress(leaf.key)) {
            return false;
        }
        PbModels.ProtoStateIdentity memory value;
        value = PbModels.decProtoStateIdentity(valueWithProof.value);
        bytes32 valueHash = sha256(valueWithProof.value);
        if (sha256(abi.encodePacked(valueHash)) != sha256(leaf.valueHash)) {
            return false;
        }
        bytes memory bs = abi.encodePacked(
            encodeVarint(0 << 1),
            encodeVarint(1 << 1),
            encodeVarint(leaf.version << 1),
            encodeVarint(leaf.key.length),
            leaf.key,
            encodeVarint(leaf.valueHash.length),
            leaf.valueHash
        );
        bytes32 resHash = sha256(bs);
        for (uint256 i = 0; i < valueWithProof.proof.length; i++) {
            PbModels.ProofItem memory proofItem = valueWithProof.proof[valueWithProof.proof.length - i - 1];
            bytes memory cHash = abi.encodePacked(resHash);
            if (proofItem.left.length > 0) {
                bs = abi.encodePacked(
                    encodeVarint(proofItem.height << 1),
                    encodeVarint(proofItem.size << 1),
                    encodeVarint(proofItem.version << 1),
                    encodeVarint(proofItem.left.length),
                    proofItem.left,
                    encodeVarint(cHash.length),
                    cHash
                );
            } else {
                bs = abi.encodePacked(
                    encodeVarint(proofItem.height << 1),
                    encodeVarint(proofItem.size << 1),
                    encodeVarint(proofItem.version << 1),
                    encodeVarint(cHash.length),
                    cHash,
                    encodeVarint(proofItem.right.length),
                    proofItem.right
                );
            }
            resHash = sha256(bs);
        }
        return root == resHash && value.state == 8;
    }

    function extractAddress(bytes memory key) private pure returns (address) {
        address res;
        if (key[0] == 0x02) {
            bytes memory addressBytes = new bytes(key.length - 1);
            for (uint8 i = 1; i < key.length; i++) {
                addressBytes[i - 1] = key[i];
            }
            res = bytesToAddress(addressBytes);
        }
        return res;
    }

    function bytesToAddress(bytes memory bys) private pure returns (address addr) {
        assembly {
            addr := mload(add(bys, 20))
        }
    }

    function encodeVarint(uint x) private pure returns (bytes memory) {
        bytes memory bs = new bytes(varintSize(x));
        uint sz = 0;
        assembly {
            let bsptr := add(bs, 32)
            let byt := and(x, 0x7f)
            let pbyt := and(div(x, exp(2, 7)), 0x7f)
            for {} eq(eq(pbyt, 0), 0) {} {
                mstore8(bsptr, or(0x80, byt))
                bsptr := add(bsptr, 1)
                sz := add(sz, 1)
                byt := and(div(x, exp(2, mul(7, sz))), 0x7f)
                pbyt := and(div(x, exp(2, mul(7, add(sz, 1)))), 0x7f)
            }
            mstore8(bsptr, byt)
            sz := add(sz, 1)
        }
        return bs;
    }

    function varintSize(uint i) private pure returns (uint) {
        uint count = 1;
        assembly {
            for {} eq(lt(i, exp(2, mul(7, count))), 0) {} {
                count := add(count, 1)
            }
        }
        return count;
    }

    function splitSignature(bytes memory sig)
    public
    pure
    returns (
        bytes32 r,
        bytes32 s,
        uint8 v
    )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
        /*
        First 32 bytes stores the length of the signature

        add(sig, 32) = pointer of sig + 32
        effectively, skips first 32 bytes of signature

        mload(p) loads next 32 bytes starting at the memory address p into memory
        */

        // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
        // second 32 bytes
            s := mload(add(sig, 64))
        // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

}
