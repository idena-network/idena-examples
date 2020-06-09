/* solium-disable */
pragma solidity >=0.4.25 <0.7.0;

import "./runtime.sol";


library pb_ProtoTransaction {
    //struct definition
    struct Data {
        pb_ProtoTransaction_Data.Data data;
        bytes signature;
        bool useRlp;
    }

    // Decoder section
    function decode(bytes memory bs) internal pure returns (Data memory) {
        (Data memory x, ) = _decode(32, bs, bs.length);
        return x;
    }

    function decode(Data storage self, bytes memory bs) internal {
        (Data memory x, ) = _decode(32, bs, bs.length);
        store(x, self);
    }

    // innter decoder
    function _decode(
        uint256 p,
        bytes memory bs,
        uint256 sz
    ) internal pure returns (Data memory, uint256) {
        Data memory r;
        uint256[4] memory counters;
        uint256 fieldId;
        _pb.WireType wireType;
        uint256 bytesRead;
        uint256 offset = p;
        while (p < offset + sz) {
            (fieldId, wireType, bytesRead) = _pb._decode_key(p, bs);
            p += bytesRead;
            if (false) {} else if (fieldId == 1)
                p += _read_data(p, bs, r, counters);
            else if (fieldId == 2) p += _read_signature(p, bs, r, counters);
            else if (fieldId == 3) p += _read_useRlp(p, bs, r, counters);
            else revert();
        }
        p = offset;

        while (p < offset + sz) {
            (fieldId, wireType, bytesRead) = _pb._decode_key(p, bs);
            p += bytesRead;
            if (false) {} else if (fieldId == 1)
                p += _read_data(p, bs, nil(), counters);
            else if (fieldId == 2) p += _read_signature(p, bs, nil(), counters);
            else if (fieldId == 3) p += _read_useRlp(p, bs, nil(), counters);
            else revert();
        }
        return (r, sz);
    }

    // field readers
    function _read_data(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[4] memory counters
    ) internal pure returns (uint256) {
        (
            pb_ProtoTransaction_Data.Data memory x,
            uint256 sz
        ) = _decode_ProtoTransaction_Data(p, bs);
        if (isNil(r)) {
            counters[1] += 1;
        } else {
            r.data = x;
            if (counters[1] > 0) counters[1] -= 1;
        }
        return sz;
    }

    function _read_signature(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[4] memory counters
    ) internal pure returns (uint256) {
        (bytes memory x, uint256 sz) = _pb._decode_bytes(p, bs);
        if (isNil(r)) {
            counters[2] += 1;
        } else {
            r.signature = x;
            if (counters[2] > 0) counters[2] -= 1;
        }
        return sz;
    }

    function _read_useRlp(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[4] memory counters
    ) internal pure returns (uint256) {
        (bool x, uint256 sz) = _pb._decode_bool(p, bs);
        if (isNil(r)) {
            counters[3] += 1;
        } else {
            r.useRlp = x;
            if (counters[3] > 0) counters[3] -= 1;
        }
        return sz;
    }

    // struct decoder
    function _decode_ProtoTransaction_Data(uint256 p, bytes memory bs)
        internal
        pure
        returns (pb_ProtoTransaction_Data.Data memory, uint256)
    {
        (uint256 sz, uint256 bytesRead) = _pb._decode_varint(p, bs);
        p += bytesRead;
        (pb_ProtoTransaction_Data.Data memory r, ) = pb_ProtoTransaction_Data
            ._decode(p, bs, sz);
        return (r, sz + bytesRead);
    }

    // Encoder section
    function encode(Data memory r) internal pure returns (bytes memory) {
        bytes memory bs = new bytes(_estimate(r));
        uint256 sz = _encode(r, 32, bs);
        assembly {
            mstore(bs, sz)
        }
        return bs;
    }

    // inner encoder
    function _encode(
        Data memory r,
        uint256 p,
        bytes memory bs
    ) internal pure returns (uint256) {
        uint256 offset = p;

        p += _pb._encode_key(1, _pb.WireType.LengthDelim, p, bs);
        p += pb_ProtoTransaction_Data._encode_nested(r.data, p, bs);
        p += _pb._encode_key(2, _pb.WireType.LengthDelim, p, bs);
        p += _pb._encode_bytes(r.signature, p, bs);
        p += _pb._encode_key(3, _pb.WireType.Varint, p, bs);
        p += _pb._encode_bool(r.useRlp, p, bs);

        return p - offset;
    }

    // nested encoder
    function _encode_nested(
        Data memory r,
        uint256 p,
        bytes memory bs
    ) internal pure returns (uint256) {
        uint256 offset = p;
        p += _pb._encode_varint(_estimate(r), p, bs);
        p += _encode(r, p, bs);
        return p - offset;
    }

    // estimator
    function _estimate(Data memory r) internal pure returns (uint256) {
        uint256 e;

        e += 1 + _pb._sz_lendelim(pb_ProtoTransaction_Data._estimate(r.data));
        e += 1 + _pb._sz_lendelim(r.signature.length);
        e += 1 + 1;

        return e;
    }

    //store function
    function store(Data memory input, Data storage output) internal {
        pb_ProtoTransaction_Data.store(input.data, output.data);
        output.signature = input.signature;
        output.useRlp = input.useRlp;
    }

    //utility functions
    function nil() internal pure returns (Data memory r) {
        assembly {
            r := 0
        }
    }

    function isNil(Data memory x) internal pure returns (bool r) {
        assembly {
            r := iszero(x)
        }
    }
} //library pb_ProtoTransaction


library pb_ProtoTransaction_Data {
    //struct definition
    struct Data {
        uint32 nonce;
        uint32 epoch;
        uint32 txType;
        bytes to;
        bytes amount;
        bytes maxFee;
        bytes tips;
        bytes payload;
    }

    // Decoder section
    function decode(bytes memory bs) internal pure returns (Data memory) {
        (Data memory x, ) = _decode(32, bs, bs.length);
        return x;
    }

    function decode(Data storage self, bytes memory bs) internal {
        (Data memory x, ) = _decode(32, bs, bs.length);
        store(x, self);
    }

    // innter decoder
    function _decode(
        uint256 p,
        bytes memory bs,
        uint256 sz
    ) internal pure returns (Data memory, uint256) {
        Data memory r;
        uint256[9] memory counters;
        uint256 fieldId;
        _pb.WireType wireType;
        uint256 bytesRead;
        uint256 offset = p;
        while (p < offset + sz) {
            (fieldId, wireType, bytesRead) = _pb._decode_key(p, bs);
            p += bytesRead;
            if (false) {} else if (fieldId == 1)
                p += _read_nonce(p, bs, r, counters);
            else if (fieldId == 2) p += _read_epoch(p, bs, r, counters);
            else if (fieldId == 3) p += _read_txType(p, bs, r, counters);
            else if (fieldId == 4) p += _read_to(p, bs, r, counters);
            else if (fieldId == 5) p += _read_amount(p, bs, r, counters);
            else if (fieldId == 6) p += _read_maxFee(p, bs, r, counters);
            else if (fieldId == 7) p += _read_tips(p, bs, r, counters);
            else if (fieldId == 8) p += _read_payload(p, bs, r, counters);
            else revert();
        }
        p = offset;

        while (p < offset + sz) {
            (fieldId, wireType, bytesRead) = _pb._decode_key(p, bs);
            p += bytesRead;
            if (false) {} else if (fieldId == 1)
                p += _read_nonce(p, bs, nil(), counters);
            else if (fieldId == 2) p += _read_epoch(p, bs, nil(), counters);
            else if (fieldId == 3) p += _read_txType(p, bs, nil(), counters);
            else if (fieldId == 4) p += _read_to(p, bs, nil(), counters);
            else if (fieldId == 5) p += _read_amount(p, bs, nil(), counters);
            else if (fieldId == 6) p += _read_maxFee(p, bs, nil(), counters);
            else if (fieldId == 7) p += _read_tips(p, bs, nil(), counters);
            else if (fieldId == 8) p += _read_payload(p, bs, nil(), counters);
            else revert();
        }
        return (r, sz);
    }

    // field readers
    function _read_nonce(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (uint32 x, uint256 sz) = _pb._decode_uint32(p, bs);
        if (isNil(r)) {
            counters[1] += 1;
        } else {
            r.nonce = x;
            if (counters[1] > 0) counters[1] -= 1;
        }
        return sz;
    }

    function _read_epoch(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (uint32 x, uint256 sz) = _pb._decode_uint32(p, bs);
        if (isNil(r)) {
            counters[2] += 1;
        } else {
            r.epoch = x;
            if (counters[2] > 0) counters[2] -= 1;
        }
        return sz;
    }

    function _read_txType(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (uint32 x, uint256 sz) = _pb._decode_uint32(p, bs);
        if (isNil(r)) {
            counters[3] += 1;
        } else {
            r.txType = x;
            if (counters[3] > 0) counters[3] -= 1;
        }
        return sz;
    }

    function _read_to(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (bytes memory x, uint256 sz) = _pb._decode_bytes(p, bs);
        if (isNil(r)) {
            counters[4] += 1;
        } else {
            r.to = x;
            if (counters[4] > 0) counters[4] -= 1;
        }
        return sz;
    }

    function _read_amount(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (bytes memory x, uint256 sz) = _pb._decode_bytes(p, bs);
        if (isNil(r)) {
            counters[5] += 1;
        } else {
            r.amount = x;
            if (counters[5] > 0) counters[5] -= 1;
        }
        return sz;
    }

    function _read_maxFee(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (bytes memory x, uint256 sz) = _pb._decode_bytes(p, bs);
        if (isNil(r)) {
            counters[6] += 1;
        } else {
            r.maxFee = x;
            if (counters[6] > 0) counters[6] -= 1;
        }
        return sz;
    }

    function _read_tips(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (bytes memory x, uint256 sz) = _pb._decode_bytes(p, bs);
        if (isNil(r)) {
            counters[7] += 1;
        } else {
            r.tips = x;
            if (counters[7] > 0) counters[7] -= 1;
        }
        return sz;
    }

    function _read_payload(
        uint256 p,
        bytes memory bs,
        Data memory r,
        uint256[9] memory counters
    ) internal pure returns (uint256) {
        (bytes memory x, uint256 sz) = _pb._decode_bytes(p, bs);
        if (isNil(r)) {
            counters[8] += 1;
        } else {
            r.payload = x;
            if (counters[8] > 0) counters[8] -= 1;
        }
        return sz;
    }

    // struct decoder

    // Encoder section
    function encode(Data memory r) internal pure returns (bytes memory) {
        bytes memory bs = new bytes(_estimate(r));
        uint256 sz = _encode(r, 32, bs);
        assembly {
            mstore(bs, sz)
        }
        return bs;
    }

    // inner encoder
    function _encode(
        Data memory r,
        uint256 p,
        bytes memory bs
    ) internal pure returns (uint256) {
        uint256 offset = p;

        p += _pb._encode_key(1, _pb.WireType.Varint, p, bs);
        p += _pb._encode_uint32(r.nonce, p, bs);
        p += _pb._encode_key(2, _pb.WireType.Varint, p, bs);
        p += _pb._encode_uint32(r.epoch, p, bs);
        p += _pb._encode_key(3, _pb.WireType.Varint, p, bs);
        p += _pb._encode_uint32(r.txType, p, bs);
        p += _pb._encode_key(4, _pb.WireType.LengthDelim, p, bs);
        p += _pb._encode_bytes(r.to, p, bs);
        p += _pb._encode_key(5, _pb.WireType.LengthDelim, p, bs);
        p += _pb._encode_bytes(r.amount, p, bs);
        p += _pb._encode_key(6, _pb.WireType.LengthDelim, p, bs);
        p += _pb._encode_bytes(r.maxFee, p, bs);
        p += _pb._encode_key(7, _pb.WireType.LengthDelim, p, bs);
        p += _pb._encode_bytes(r.tips, p, bs);
        p += _pb._encode_key(8, _pb.WireType.LengthDelim, p, bs);
        p += _pb._encode_bytes(r.payload, p, bs);

        return p - offset;
    }

    // nested encoder
    function _encode_nested(
        Data memory r,
        uint256 p,
        bytes memory bs
    ) internal pure returns (uint256) {
        uint256 offset = p;
        p += _pb._encode_varint(_estimate(r), p, bs);
        p += _encode(r, p, bs);
        return p - offset;
    }

    // estimator
    function _estimate(Data memory r) internal pure returns (uint256) {
        uint256 e;

        e += 1 + _pb._sz_uint32(r.nonce);
        e += 1 + _pb._sz_uint32(r.epoch);
        e += 1 + _pb._sz_uint32(r.txType);
        e += 1 + _pb._sz_lendelim(r.to.length);
        e += 1 + _pb._sz_lendelim(r.amount.length);
        e += 1 + _pb._sz_lendelim(r.maxFee.length);
        e += 1 + _pb._sz_lendelim(r.tips.length);
        e += 1 + _pb._sz_lendelim(r.payload.length);

        return e;
    }

    //store function
    function store(Data memory input, Data storage output) internal {
        output.nonce = input.nonce;
        output.epoch = input.epoch;
        output.txType = input.txType;
        output.to = input.to;
        output.amount = input.amount;
        output.maxFee = input.maxFee;
        output.tips = input.tips;
        output.payload = input.payload;
    }

    //utility functions
    function nil() internal pure returns (Data memory r) {
        assembly {
            r := 0
        }
    }

    function isNil(Data memory x) internal pure returns (bool r) {
        assembly {
            r := iszero(x)
        }
    }
} //library pb_ProtoTransaction_Data
