// SPDX-License-Identifier: MIT
// Code generated by protoc-gen-sol. DO NOT EDIT.
// source: identityProof.proto
pragma solidity >=0.4.22 <0.9.0;

library PbModels {
    using Pb for Pb.Buffer;  // so we can call Pb funcs on Buffer obj

    struct ProofLeaf {
        bytes key;   // tag: 1
        bytes valueHash;   // tag: 2
        uint64 version;   // tag: 3
    } // end struct ProofLeaf

    function decProofLeaf(bytes memory raw) internal pure returns (ProofLeaf memory m) {
        Pb.Buffer memory buf = Pb.fromBytes(raw);

        uint tag;
        Pb.WireType wire;
        while (buf.hasMore()) {
            (tag, wire) = buf.decKey();
            if (false) {} // solidity has no switch/case
            else if (tag == 1) {
                m.key = bytes(buf.decBytes());
            }
            else if (tag == 2) {
                m.valueHash = bytes(buf.decBytes());
            }
            else if (tag == 3) {
                m.version = uint64(buf.decVarint());
            }
            else { buf.skipValue(wire); } // skip value of unknown tag
        }
    } // end decoder ProofLeaf

    struct ProofItem {
        uint32 height;   // tag: 1
        uint64 size;   // tag: 2
        uint64 version;   // tag: 3
        bytes left;   // tag: 4
        bytes right;   // tag: 5
    } // end struct ProofItem

    function decProofItem(bytes memory raw) internal pure returns (ProofItem memory m) {
        Pb.Buffer memory buf = Pb.fromBytes(raw);

        uint tag;
        Pb.WireType wire;
        while (buf.hasMore()) {
            (tag, wire) = buf.decKey();
            if (false) {} // solidity has no switch/case
            else if (tag == 1) {
                m.height = uint32(buf.decVarint());
            }
            else if (tag == 2) {
                m.size = uint64(buf.decVarint());
            }
            else if (tag == 3) {
                m.version = uint64(buf.decVarint());
            }
            else if (tag == 4) {
                m.left = bytes(buf.decBytes());
            }
            else if (tag == 5) {
                m.right = bytes(buf.decBytes());
            }
            else { buf.skipValue(wire); } // skip value of unknown tag
        }
    } // end decoder ProofItem

    struct ValueWithProof {
        bytes value;   // tag: 1
        ProofLeaf leaf;   // tag: 2
        ProofItem[] proof;   // tag: 3
    } // end struct ValueWithProof

    function decValueWithProof(bytes memory raw) internal pure returns (ValueWithProof memory m) {
        Pb.Buffer memory buf = Pb.fromBytes(raw);

        uint[] memory cnts = buf.cntTags(3);
        m.proof = new ProofItem[](cnts[3]);
        cnts[3] = 0;  // reset counter for later use
        
        uint tag;
        Pb.WireType wire;
        while (buf.hasMore()) {
            (tag, wire) = buf.decKey();
            if (false) {} // solidity has no switch/case
            else if (tag == 1) {
                m.value = bytes(buf.decBytes());
            }
            else if (tag == 2) {
                m.leaf = decProofLeaf(buf.decBytes());
            }
            else if (tag == 3) {
                m.proof[cnts[3]] = decProofItem(buf.decBytes());
                cnts[3]++;
            }
            else { buf.skipValue(wire); } // skip value of unknown tag
        }
    } // end decoder ValueWithProof

    struct ProtoStateIdentity {
        bytes stake;   // tag: 1
        uint32 invites;   // tag: 2
        uint32 birthday;   // tag: 3
        uint32 state;   // tag: 4
        uint32 qualifiedFlips;   // tag: 5
        uint32 shortFlipPoints;   // tag: 6
        bytes pubKey;   // tag: 7
        uint32 requiredFlips;   // tag: 8
        Flip[] flips;   // tag: 9
        uint32 generation;   // tag: 10
        bytes code;   // tag: 11
        TxAddr[] invitees;   // tag: 12
        Inviter inviter;   // tag: 13
        bytes penalty;   // tag: 14
        uint32 validationBits;   // tag: 15
        uint32 validationStatus;   // tag: 16
        bytes profileHash;   // tag: 17
        bytes scores;   // tag: 18
        bytes delegatee;   // tag: 19
        uint32 delegationNonce;   // tag: 20
        uint32 delegationEpoch;   // tag: 21
        uint32 shardId;   // tag: 22
    } // end struct ProtoStateIdentity

    function decProtoStateIdentity(bytes memory raw) internal pure returns (ProtoStateIdentity memory m) {
        Pb.Buffer memory buf = Pb.fromBytes(raw);

        uint[] memory cnts = buf.cntTags(22);
        m.flips = new Flip[](cnts[9]);
        cnts[9] = 0;  // reset counter for later use
        m.invitees = new TxAddr[](cnts[12]);
        cnts[12] = 0;  // reset counter for later use
        
        uint tag;
        Pb.WireType wire;
        while (buf.hasMore()) {
            (tag, wire) = buf.decKey();
            if (false) {} // solidity has no switch/case
            else if (tag == 1) {
                m.stake = bytes(buf.decBytes());
            }
            else if (tag == 2) {
                m.invites = uint32(buf.decVarint());
            }
            else if (tag == 3) {
                m.birthday = uint32(buf.decVarint());
            }
            else if (tag == 4) {
                m.state = uint32(buf.decVarint());
            }
            else if (tag == 5) {
                m.qualifiedFlips = uint32(buf.decVarint());
            }
            else if (tag == 6) {
                m.shortFlipPoints = uint32(buf.decVarint());
            }
            else if (tag == 7) {
                m.pubKey = bytes(buf.decBytes());
            }
            else if (tag == 8) {
                m.requiredFlips = uint32(buf.decVarint());
            }
            else if (tag == 9) {
                m.flips[cnts[9]] = decFlip(buf.decBytes());
                cnts[9]++;
            }
            else if (tag == 10) {
                m.generation = uint32(buf.decVarint());
            }
            else if (tag == 11) {
                m.code = bytes(buf.decBytes());
            }
            else if (tag == 12) {
                m.invitees[cnts[12]] = decTxAddr(buf.decBytes());
                cnts[12]++;
            }
            else if (tag == 13) {
                m.inviter = decInviter(buf.decBytes());
            }
            else if (tag == 14) {
                m.penalty = bytes(buf.decBytes());
            }
            else if (tag == 15) {
                m.validationBits = uint32(buf.decVarint());
            }
            else if (tag == 16) {
                m.validationStatus = uint32(buf.decVarint());
            }
            else if (tag == 17) {
                m.profileHash = bytes(buf.decBytes());
            }
            else if (tag == 18) {
                m.scores = bytes(buf.decBytes());
            }
            else if (tag == 19) {
                m.delegatee = bytes(buf.decBytes());
            }
            else if (tag == 20) {
                m.delegationNonce = uint32(buf.decVarint());
            }
            else if (tag == 21) {
                m.delegationEpoch = uint32(buf.decVarint());
            }
            else if (tag == 22) {
                m.shardId = uint32(buf.decVarint());
            }
            else { buf.skipValue(wire); } // skip value of unknown tag
        }
    } // end decoder ProtoStateIdentity

    struct Flip {
        bytes cid;   // tag: 1
        uint32 pair;   // tag: 2
    } // end struct Flip

    function decFlip(bytes memory raw) internal pure returns (Flip memory m) {
        Pb.Buffer memory buf = Pb.fromBytes(raw);

        uint tag;
        Pb.WireType wire;
        while (buf.hasMore()) {
            (tag, wire) = buf.decKey();
            if (false) {} // solidity has no switch/case
            else if (tag == 1) {
                m.cid = bytes(buf.decBytes());
            }
            else if (tag == 2) {
                m.pair = uint32(buf.decVarint());
            }
            else { buf.skipValue(wire); } // skip value of unknown tag
        }
    } // end decoder Flip

    struct TxAddr {
        bytes hash;   // tag: 1
        bytes addr;   // tag: 2
    } // end struct TxAddr

    function decTxAddr(bytes memory raw) internal pure returns (TxAddr memory m) {
        Pb.Buffer memory buf = Pb.fromBytes(raw);

        uint tag;
        Pb.WireType wire;
        while (buf.hasMore()) {
            (tag, wire) = buf.decKey();
            if (false) {} // solidity has no switch/case
            else if (tag == 1) {
                m.hash = bytes(buf.decBytes());
            }
            else if (tag == 2) {
                m.addr = bytes(buf.decBytes());
            }
            else { buf.skipValue(wire); } // skip value of unknown tag
        }
    } // end decoder TxAddr

    struct Inviter {
        bytes hash;   // tag: 1
        bytes addr;   // tag: 2
        uint32 epochHeight;   // tag: 3
    } // end struct Inviter

    function decInviter(bytes memory raw) internal pure returns (Inviter memory m) {
        Pb.Buffer memory buf = Pb.fromBytes(raw);

        uint tag;
        Pb.WireType wire;
        while (buf.hasMore()) {
            (tag, wire) = buf.decKey();
            if (false) {} // solidity has no switch/case
            else if (tag == 1) {
                m.hash = bytes(buf.decBytes());
            }
            else if (tag == 2) {
                m.addr = bytes(buf.decBytes());
            }
            else if (tag == 3) {
                m.epochHeight = uint32(buf.decVarint());
            }
            else { buf.skipValue(wire); } // skip value of unknown tag
        }
    } // end decoder Inviter

}

// runtime proto sol library
library Pb {
    enum WireType { Varint, Fixed64, LengthDelim, StartGroup, EndGroup, Fixed32 }

    struct Buffer {
        uint idx;  // the start index of next read. when idx=b.length, we're done
        bytes b;   // hold serialized proto msg, readonly
    }

    // create a new in-memory Buffer object from raw msg bytes
    function fromBytes(bytes memory raw) internal pure returns (Buffer memory buf) {
        buf.b = raw;
        buf.idx = 0;
    }

    // whether there are unread bytes
    function hasMore(Buffer memory buf) internal pure returns (bool) {
        return buf.idx < buf.b.length;
    }

    // decode current field number and wiretype
    function decKey(Buffer memory buf) internal pure returns (uint tag, WireType wiretype) {
        uint v = decVarint(buf);
        tag = v / 8;
        wiretype = WireType(v & 7);
    }

    // count tag occurrences, return an array due to no memory map support
	// have to create array for (maxtag+1) size. cnts[tag] = occurrences
	// should keep buf.idx unchanged because this is only a count function
    function cntTags(Buffer memory buf, uint maxtag) internal pure returns (uint[] memory cnts) {
        uint originalIdx = buf.idx;
        cnts = new uint[](maxtag+1);  // protobuf's tags are from 1 rather than 0
        uint tag;
        WireType wire;
        while (hasMore(buf)) {
            (tag, wire) = decKey(buf);
            cnts[tag] += 1;
            skipValue(buf, wire);
        }
        buf.idx = originalIdx;
    }

    // read varint from current buf idx, move buf.idx to next read, return the int value
    function decVarint(Buffer memory buf) internal pure returns (uint v) {
        bytes10 tmp;  // proto int is at most 10 bytes (7 bits can be used per byte)
        bytes memory bb = buf.b;  // get buf.b mem addr to use in assembly
        v = buf.idx;  // use v to save one additional uint variable
        assembly {
            tmp := mload(add(add(bb, 32), v)) // load 10 bytes from buf.b[buf.idx] to tmp
        }
        uint b; // store current byte content
        v = 0; // reset to 0 for return value
        for (uint i=0; i<10; ++i) {
            assembly {
                b := byte(i, tmp)  // don't use tmp[i] because it does bound check and costs extra
            }
            v |= (b & 0x7F) << (i * 7);
            if (b & 0x80 == 0) {
                buf.idx += i + 1;
                return v;
            }
        }
        revert(); // i=10, invalid varint stream
    }

    // read length delimited field and return bytes
    function decBytes(Buffer memory buf) internal pure returns (bytes memory b) {
        uint len = decVarint(buf);
        uint end = buf.idx + len;
        require(end <= buf.b.length);  // avoid overflow
        b = new bytes(len);
        bytes memory bufB = buf.b;  // get buf.b mem addr to use in assembly
        uint bStart;
        uint bufBStart = buf.idx;
        assembly {
            bStart := add(b, 32)
            bufBStart := add(add(bufB, 32), bufBStart)
        }
        for (uint i=0; i<len; i+=32) {
            assembly{
                mstore(add(bStart, i), mload(add(bufBStart, i)))
            }
        }
        buf.idx = end;
    }

    // return packed ints
    function decPacked(Buffer memory buf) internal pure returns (uint[] memory t) {
        uint len = decVarint(buf);
        uint end = buf.idx + len;
        require(end <= buf.b.length);  // avoid overflow
        // array in memory must be init w/ known length
        // so we have to create a tmp array w/ max possible len first
        uint[] memory tmp = new uint[](len);
        uint i = 0; // count how many ints are there
        while (buf.idx < end) {
            tmp[i] = decVarint(buf);
            i++;
        }
        t = new uint[](i); // init t with correct length
        for (uint j=0; j<i; j++) {
            t[j] = tmp[j];
        }
        return t;
    }

    // move idx pass current value field, to beginning of next tag or msg end
    function skipValue(Buffer memory buf, WireType wire) internal pure {
        if (wire == WireType.Varint) { decVarint(buf); }
        else if (wire == WireType.LengthDelim) {
            uint len = decVarint(buf);
            buf.idx += len; // skip len bytes value data
            require(buf.idx <= buf.b.length);  // avoid overflow
        } else { revert(); }  // unsupported wiretype
    }

    // type conversion help utils
    function _bool(uint x) internal pure returns (bool v) {
        return x != 0;
    }

    function _uint256(bytes memory b) internal pure returns (uint256 v) {
        assembly { v := mload(add(b, 32)) }  // load all 32bytes to v
        v = v >> (8 * (32 - b.length));  // only first b.length is valid
    }

    function _address(bytes memory b) internal pure returns (address v) {
        v = _addressPayable(b);
    }

    function _addressPayable(bytes memory b) internal pure returns (address payable v) {
        require(b.length == 20);
        //load 32bytes then shift right 12 bytes
        assembly { v := div(mload(add(b, 32)), 0x1000000000000000000000000) }
    }

    function _bytes32(bytes memory b) internal pure returns (bytes32 v) {
        require(b.length == 32);
        assembly { v := mload(add(b, 32)) }
    }

    // uint[] to uint8[]
    function uint8s(uint[] memory arr) internal pure returns (uint8[] memory t) {
        t = new uint8[](arr.length);
        for (uint i = 0; i < t.length; i++) { t[i] = uint8(arr[i]); }
    }

    function uint32s(uint[] memory arr) internal pure returns (uint32[] memory t) {
        t = new uint32[](arr.length);
        for (uint i = 0; i < t.length; i++) { t[i] = uint32(arr[i]); }
    }

    function uint64s(uint[] memory arr) internal pure returns (uint64[] memory t) {
        t = new uint64[](arr.length);
        for (uint i = 0; i < t.length; i++) { t[i] = uint64(arr[i]); }
    }

    function bools(uint[] memory arr) internal pure returns (bool[] memory t) {
        t = new bool[](arr.length);
        for (uint i = 0; i < t.length; i++) { t[i] = arr[i]!=0; }
    }
}

