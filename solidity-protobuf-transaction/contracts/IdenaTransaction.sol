pragma solidity >=0.4.25 <0.7.0;

import "./Transaction_pb.sol";


contract IdenaTransaction {
    function parseTx(bytes memory data)
        public
        pure
        returns (
            bytes memory to,
            bytes memory amount,
            bytes memory maxFee,
            bytes memory tips,
            bytes memory payload,
            bytes memory signature,
            bool useRlp
        )
    {
        pb_ProtoTransaction.Data memory result;
        result = pb_ProtoTransaction.decode(data);
        return (
            result.data.to,
            result.data.amount,
            result.data.maxFee,
            result.data.tips,
            result.data.payload,
            result.signature,
            result.useRlp
        );
    }

    function parseTxData(bytes memory data)
        public
        pure
        returns (
            uint32,
            uint32,
            uint32
        )
    {
        pb_ProtoTransaction_Data.Data memory result;
        result = pb_ProtoTransaction_Data.decode(data);
        return (result.nonce, result.epoch, result.txType);
    }

    function createTxData(
        uint32 nonce,
        uint32 epoch,
        uint32 txType
    ) public pure returns (bytes memory) {
        pb_ProtoTransaction.Data memory result;
        result.data.nonce = nonce;
        result.data.epoch = epoch;
        result.data.txType = txType;

        return pb_ProtoTransaction.encode(result);
    }

    function checkSignature(address a, bytes memory data)
        public
        pure
        returns (bool)
    {
        pb_ProtoTransaction.Data memory result;
        result = pb_ProtoTransaction.decode(data);

        // decode internal data to bytes, to calculate hash
        bytes memory internalBytes = pb_ProtoTransaction_Data.encode(
            result.data
        );

        bytes32 h = keccak256(internalBytes);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(result.signature);

        return a == ecrecover(h, v + 27, r, s);
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
