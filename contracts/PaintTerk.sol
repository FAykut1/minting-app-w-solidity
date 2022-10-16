// SPDX-Licence-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PaintTerk is ERC721, Ownable {
    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    string internal baseTokenUri;
    address payable public withdrawWallet;
    mapping(address => string[]) ownedNFTs;

    constructor() payable ERC721("PaintTerk", "RP") {
        mintPrice = 0.001 ether;
        totalSupply = 0;
        maxSupply = 100;
        baseTokenUri = "gs://my-minting-app.appspot.com/images/";
    }

    function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner {
        baseTokenUri = _baseTokenUri;
    }

    function getNFTs() public view returns (string[] memory) {
        return ownedNFTs[msg.sender];
    }

    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{value: address(this).balance}(
            ""
        );
        require(success, "Withdraw failed");
    }

    function mint(uint256 _quantity, string memory _uri) public payable {
        require(msg.value == _quantity * mintPrice, "Wrong mint value");
        require(totalSupply + _quantity <= maxSupply, "Sold out");

        for (uint256 i = 0; i < _quantity; i++) {
            uint256 newTokenId = ++totalSupply;

            ownedNFTs[msg.sender].push(
                string(
                    abi.encodePacked(Strings.toString(newTokenId), ",", _uri)
                )
            );
            _safeMint(msg.sender, newTokenId);
        }
    }
}
