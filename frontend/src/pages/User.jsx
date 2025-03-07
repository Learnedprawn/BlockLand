import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Home, Map, CheckCircle, Shield, Book, Search, DollarSign, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SingleOwnerNFT from "../../../out/SingleOwnerNFT.sol/SingleOwnerNFT.json";
import MarketPlace from "../../../out/MarketPlace.sol/MarketPlace.json";

const User = () => {
  const navigate = useNavigate();
  const [tokenId, setTokenId] = useState('');
  const [nftContract, setNFTContract] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [marketPlaceContract, setMarketPlaceContract] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [buyerAddress, setBuyerAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const nftContractInstance = new ethers.Contract(
        import.meta.env.VITE_SINGLE_OWNER_NFT,
        SingleOwnerNFT.abi,
        signer
      );

      const marketPlaceContractInstance = new ethers.Contract(
        import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS,
        MarketPlace.abi,
        signer
      );

      setNFTContract(nftContractInstance);
      setMarketPlaceContract(marketPlaceContractInstance);
    }
  }, []);

  const handleTokenSearch = async () => {
    if (tokenId.trim()) {
      try {
        const tokenDetails = await nftContract.getLandData(tokenId);
        setSearchResult(tokenDetails);
      } catch (error) {
        console.error("Error fetching token details:", error);
        alert("Error fetching token details. Please check the token ID and try again.");
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleSellButtonClick = () => {
    setShowSellModal(true);
  };

  const handleSellNFT = async () => {
    if (!buyerAddress || !ethers.utils.isAddress(buyerAddress)) {
      alert('Please enter a valid Ethereum address');
      return;
    }

    setIsProcessing(true);
    try {
      // First, add the land to the marketplace
      const addToMarketTx = await marketPlaceContract.addLandToMarketPlace(tokenId, buyerAddress, { gasLimit: 10000000 });
      await addToMarketTx.wait();

      alert(`Land NFT successfully listed for sale to ${formatAddress(buyerAddress)}`);
      setShowSellModal(false);
      setBuyerAddress('');
    } catch (error) {
      console.error("Transaction error:", error);
      alert(`Error during transaction: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
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
                  onClick={handleSellButtonClick}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Sell NFT</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Sell Land NFT</h3>
              <button
                onClick={() => setShowSellModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="mb-4 text-sm text-gray-600">
                Enter the Ethereum address of the buyer to sell this land NFT.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer's Ethereum Address
                </label>
                <input
                  type="text"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSellModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellNFT}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-sm flex items-center space-x-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4" />
                      <span>Confirm Sale</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;