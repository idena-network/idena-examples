const {
    signVote,
} = require('./utils')
const IdenaHumanVoting = artifacts.require('IdenaHumanVoting');
const truffleAssert = require('truffle-assertions');

contract('IdenaHumanVoting', (accounts) => {

    it('must finish voting with winner', async () => {

        async function mineBlock() {
            await web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                id: 1
            }, function (err, result) {
            });
        }

        const rootHash = '0xcf0829e52f8227869e6ee6e474b935042541ab2da1c6c98050d38b0f2d9bd247';

        const voters = [
            {
                merkleProofData: '0x0a700a090223a5644e535d2d9c1001180120083a41044a4ea6e13d605e159178e414d2cb146753a396bf5ee65bcd348f21a5fe42b94accbddafa9ecb0899c0950e2672c16545ad2caad2839bc683673ec7d3473b616e400350025a0c8e82af7d526428b804b99f9f920104c6c6c6c6b00101123c0a15029dc9fe141805cd50bc8db259acf7237f077effe2122030aa97706cfeea9ab52bde11b9058a09af31623f3ee784a2192bd3732412b2e518d3011a290805100e18d3012a203f91b8e5f6a2616bbab3ab5f5ed145cc7f9887786653bf6495324fa0b533a12b1a290804100918d30122207b44a020b08a5f355b7647d042b5142736ac42fb1bc028cb3ee07cfa941ac3181a290802100418d301222010993e816a01031ec4a67e14aa67d4ba8b963ce83b491dccd06bc2a4e31b1aa51a290801100218d3012220fc036666a2e9999d700a380983623122b29055dde26337c88b0a2e2959dd7509',
                key: 'e532ee1ec0d4136f7da0a141a78328e1010c329dde51770c109cf19040245090'
            },
            {
                merkleProofData: '0x0a6f0a090308fd597dbd9ea09d100120083a41041e51a6b5b734fb00ed87413281ba8c1ec2252e5ba454bd9dff4fe4ec7306aabbe7b37bb0b41ddd5839734590d9deca78696205691558bbca632e5ee2f0cc480b400350025a0c8e82af7d526428b804b99f9f92010521c6c6c6c6b00101123c0a1502ef514aa93ca6da73bb91cd335333a4c5ca45730b1220227cb6edf9430522c1659503245746bc58772f19d7fb9f78754b4d39906c406a18d3011a290805100e18d3012220399d88126ee1561299ae07775c3aca995c03ed43b693563ad86d33c1f4f64db81a290803100518d3012220e3e5fd4e5c430df97024eb41ef14f1a174cb180762af8ba9bc0fdf3eacf9ec9a1a290802100318d3012a2088abde2d06aeea84c5bfe81622756a5870c3b91b26b18efb00a72c8377a945f81a290801100218d301222025b8dbaa75a13dbe58f6a80011c9850db465f8f9a8d69a3a7600694036028bc0',
                key: 'e47c753fce5224a05f19380b458304398d9ebe4c77dec94c58b93ebe9bbfe22e'
            },
            {
                merkleProofData: '0x0a6f0a090319f2579f05ba99b1100120083a4104aff6b1feee607125526540857fa3863fdec2d2783f9e1d306f3c29be004364dc39a1b09dfdd8cfdb5bc4b2ab42ddfaba8a9baac48cfc6e98654937e0b2334200400350025a0c8e82af7d526428b804b99f9f92010521c6c6c6c6b00101123c0a1502b97d1c7640ad60272a6284f154bae9adf0d1f0da1220c28f10d2261d71b66f58a64eeb0f26c752f06d14d767cf383da2213c74fbc2b118d3011a290805100e18d3012220399d88126ee1561299ae07775c3aca995c03ed43b693563ad86d33c1f4f64db81a290803100518d3012a2029534c3b334a0c67d07b9084bdadd08f3c0bf2cee20d8e4c242e114098acbed31a290801100218d301222056a9808991720f7adb0fa00249861f3b91cefbdb79ecee065d1ecc5714f27ed8',
                key: '6d7824261fabd2a8c6ecc00c82be3216805e6d5f1d473447320df7d7847fcb3f'
            }
        ]

        const maxValue = 5 // Max value to vote
        const votingDuration = 10 // Blocks
        const instance = await IdenaHumanVoting.new(rootHash, maxValue, votingDuration);
        const contractAddress = instance.address;

        await instance.vote(voters[0].merkleProofData, 3, signVote(voters[0].merkleProofData, contractAddress, 3, voters[0].key));

        await truffleAssert.reverts(
            instance.vote(voters[0].merkleProofData, 4, signVote(voters[0].merkleProofData, contractAddress, 4, voters[0].key)),
            "voter already voted"
        );

        await truffleAssert.reverts(
            instance.vote(voters[0].merkleProofData, 2, signVote(voters[0].merkleProofData, contractAddress, 2, voters[1].key),
                {gas: 200000}),
            "voter is not human"
        );
        await truffleAssert.reverts(
            instance.vote(voters[1].merkleProofData, maxValue + 1, signVote(voters[1].merkleProofData, contractAddress, maxValue + 1, voters[1].key)),
            "too high value"
        );
        await instance.vote(voters[1].merkleProofData, 2, signVote(voters[1].merkleProofData, contractAddress, 2, voters[1].key))

        for (let i = 0; i < 3; i++) {
            await mineBlock();
        }

        await instance.vote(voters[2].merkleProofData, 2, signVote(voters[2].merkleProofData, contractAddress, 2, voters[2].key))

        await truffleAssert.reverts(
            instance.finish(),
            "too early to finish voting"
        );

        await mineBlock();

        const res = await instance.finish.call();

        assert.equal(res.valueOf(), 2, 'winner value must be equal to 2');

    });
});
