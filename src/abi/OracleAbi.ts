export const OracleAbi = [
    {
        "inputs": [],
        "name": "calculateWinner",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newEndTime",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "extendTime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;
