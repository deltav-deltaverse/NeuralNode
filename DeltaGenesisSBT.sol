// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeltaGenesisSBT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId = 1;
    mapping(uint256 => bool) public soulbound;
    mapping(address => bool) public hasClaimed;

    constructor() ERC721("DeltaGenesis", "DRT") {}

    function mintGenesis(address recipient, string memory uri) external onlyOwner {
        require(!hasClaimed[recipient], "Already claimed");
        uint256 tokenId = nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        soulbound[tokenId] = true;
        hasClaimed[recipient] = true;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256) internal override {
        require(from == address(0), "Soulbound: non-transferable");
        super._beforeTokenTransfer(from, to, tokenId, 0);
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not your SBT");
        _burn(tokenId);
    }
}
