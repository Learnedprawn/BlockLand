import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Home, Map, CheckCircle, Shield, Book, Search, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SingleOwnerNFT from "../../../out/SingleOwnerNFT.sol/SingleOwnerNFT.json"


const User = () => {
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useState('');
  const [nftContract, setNFTContract] = useState(null);
  const [searchResult, setSearchResult] = useState(null);


  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();


      const nftContractInstance = new ethers.Contract(
        import.meta.env.VITE_SINGLE_OWNER_NFT,
        SingleOwnerNFT.abi,
        signer
      );
      setNFTContract(nftContractInstance);
    }
  }, []);


  const handleTokenSearch = async () => {
    if (tokenId.trim()) {

      const tokenDetails = await nftContract.getLandData(tokenId);
      setSearchResult(tokenDetails);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSellNFT = () => {
    // Handle sell NFT functionality
    alert(`Preparing to sell NFT with token ID: ${tokenId}`);
    // navigate(`/sell-nft/${tokenId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Welcome to Our Platform</h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-800 rounded-md transition-colors" onClick={() => navigate('/landregistry')}>
              <Book className="h-4 w-4" />
              <span>Land Registry</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center p-6">
        <h2 className="text-3xl font-bold text-indigo-700">Streamline Your Land Management</h2>
        <p className="text-gray-600 mt-2 max-w-lg">
          Our platform simplifies land verification, registration, and tracking to ensure transparency and security.
        </p>

        {/* Token ID Search Section */}
        <div className="mt-6 w-full max-w-md">
          <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter Token ID to search"
              className="flex-1 px-4 py-2 focus:outline-none"
            />
            <button
              onClick={handleTokenSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>


        {searchResult && (
          <div className="w-full max-w-2xl mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-indigo-700 text-white p-4">
              <h3 className="text-xl font-semibold">Land NFT Details</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Land Address</p>
                  <p className="font-medium">{searchResult.landAddress}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Owner Name</p>
                  <p className="font-medium">{searchResult.ownerName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Owner Address</p>
                  <p className="font-medium">{formatAddress(searchResult.owner)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Share Percentage</p>
                  <p className="font-medium">{searchResult.share.toString()}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Price</p>
                  <p className="font-medium">{searchResult.price.toString()} ETH</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Legal Documents</p>
                  <p className="font-medium text-blue-600 truncate">
                    {searchResult.legalDocumentsHash.substring(0, 10)}...
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSellNFT}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Sell NFT</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* <div className="mt-6 flex space-x-4">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-40">
            <Map className="h-10 w-10 text-indigo-600" />
            <p className="mt-2 font-medium">Manage Lands</p>
          </div>

          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-40">
            <CheckCircle className="h-10 w-10 text-green-600" />
            <p className="mt-2 font-medium">Verify Ownership</p>
          </div>

          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-40">
            <Shield className="h-10 w-10 text-blue-600" />
            <p className="mt-2 font-medium">Secure Transactions</p>
          </div>
        </div> */}

        {/* <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
          Get Started
        </button> */}
      </main>
    </div>
  );
};

export default User;