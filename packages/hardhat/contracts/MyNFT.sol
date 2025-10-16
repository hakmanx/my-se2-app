// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MyNFT is ERC721URIStorage, Ownable, ERC2981, ReentrancyGuard {
    uint256 private _tokenId;

    uint256 public mintPrice;
    bool public mintPaused;

    constructor(
        string memory name_,
        string memory symbol_,
        uint96 royaltyFeeNumerator_,   // 500 = 5%
        uint256 mintPriceWei
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        _setDefaultRoyalty(msg.sender, royaltyFeeNumerator_);
        mintPrice = mintPriceWei;
        mintPaused = false;
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    function setRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function pauseMint(bool p) external onlyOwner {
        mintPaused = p;
    }

    function mint(string memory tokenURI_) external payable nonReentrant {
        require(!mintPaused, "mint paused");
        require(msg.value >= mintPrice, "insufficient ETH");

        unchecked { _tokenId++; }
        uint256 tokenId = _tokenId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "withdraw failed");
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
