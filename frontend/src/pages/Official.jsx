import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, XCircle, Eye, User, Database, Shield, Filter } from 'lucide-react';
import mockdata from "../assets/mockdata.json"
import { ethers } from 'ethers';
import LandRegistry from "../../../out/LandRegistry.sol/LandRegistry.json"
// import NFTGeneration from "../../../out/NFTGeneration.sol/NFTGeneration.json"
import SingleOwnerNFT from "../../../out/SingleOwnerNFT.sol/SingleOwnerNFT.json"



// Mock function to fetch IPFS data
const fetchFromIPFS = async (hash) => {
  return {
    content: `Data for ${hash}`,
    type: hash.includes('legal') ? 'application/pdf' : 'application/json'
  };
};

const Official = () => {
  const [contract, setContract] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLand, setSelectedLand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [ipfsContent, setIpfsContent] = useState(null);


  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a new contract instance with the signer
      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_LAND_REGISTRY_CONTRACT_ADDRESS,
        LandRegistry.abi,
        signer
      );
      const nftContractInstance = new ethers.Contract(
        import.meta.env.VITE_SINGLE_OWNER_NFT,
        SingleOwnerNFT.abi,
        signer
      );
      setNFTContract(nftContractInstance);
      setContract(contractInstance);
    }
  }, []);


  useEffect(() => {
    setLoading(true);
    const getAllLand = async () => {
      const AllLands = await contract.getAllLands();
      console.log(AllLands);
      setLands(AllLands);
    }

    setLoading(false);

    if (contract) {
      getAllLand();
    }
  }, [contract]);

  // Function to verify land
  const verifyLand = async (landId) => {
    setLoading(true);

    try {
      const tx = await contract.verifyLand(landId, { gasLimit: 8000000 });
      await tx.wait();

      const updatedLands = lands.map((land) => {
        if (land.id.toString() === landId) {
          return {
            ...land,
            isVerified: true
          };
        }
        return land;
      }
      );
      setLands(updatedLands);

      mintNFT(updatedLands.find(land => land.id.toString() === landId));

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Function to view IPFS content
  const viewIPFSContent = async (hash) => {
    const url = `https://copper-magnificent-kingfisher-423.mypinata.cloud/ipfs/${hash}`;
    window.open(url, "_blank");

  };

  // Filter lands based on search term and verification status
  const filteredLands = lands.filter((land) => {
    const matchesSearch =
      land.ownerNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.landAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.id.toString().includes(searchTerm);

    if (filter === 'all') return matchesSearch;
    if (filter === 'verified') return matchesSearch && land.isVerified;
    if (filter === 'pending') return matchesSearch && !land.isVerified;
    return matchesSearch;
  });


  const mintNFT = async (land) => {
    if (land.isVerified) {

      const landData = {
        ownerName: land.ownerNames,
        landAddress: land.landAddress,
        ownershipHistoryHash: land.ownershipHistoryHash,
        legalDocumentsHash: land.legalDocumentsHash,
        owner: land.owners,
        share: ethers.BigNumber.from(land.shares),
        price: ethers.BigNumber.from(land.price)

      }
      try {
        const tx = await nftContract.mintNft(landData, { gasLimit: 8000000 });
        const receipt = await tx.wait();

        const event = receipt.events?.find(e => e.event === "NFTMinted");

        // print("NFT minted successfully", tx);
        const { owner, tokenId } = event.args;
        console.log(`NFT Minted! Owner: ${owner}, Token ID: ${tokenId}`);
        alert(`NFT Minted! Token ID: ${tokenId}`);


      } catch (error) {
        console.log("Transaction failed:", error);
      }
    }
  }
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <h1 className="text-xl font-bold">Land Registry System</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Government Official Portal</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Land list */}
        <div className="w-1/3 p-4 border-r overflow-y-auto">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Land Records</h2>
            <div className="flex items-center space-x-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="text-sm border-none focus:outline-none bg-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredLands.map((land) => (
                <li
                  key={land.id.toString()}
                  className={`p-3 hover:bg-gray-100 cursor-pointer rounded ${selectedLand?.id.toString() === land.id.toString() ? 'bg-indigo-50' : ''}`}
                  onClick={() => setSelectedLand(land)}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">ID: {land.id.toString()}</div>
                      <div className="text-sm text-gray-600">
                        {land.ownerNames}
                      </div>
                    </div>
                    <div>
                      {land.isVerified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}

              {filteredLands.length === 0 && (
                <li className="p-3 text-center text-gray-500">
                  No records found
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Right panel - Details */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedLand ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Land ID: {selectedLand.id.toString()}</h2>
                {!selectedLand.isVerified && (
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    onClick={() => verifyLand(selectedLand.id.toString())}
                  >
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Verify Land
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-medium mb-2 text-gray-700">Property Details</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Address:</strong> {selectedLand.landAddress}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Status:</strong> {selectedLand.isVerified ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-medium mb-2 text-gray-700">Ownership</h3>
                  <div className="space-y-1">
                    {/* {selectedLand.ownerNames.map((name, index) => ( */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{selectedLand.ownerNames}</span>
                        {/* <span>{selectedLand.owners}</span> */}
                      </div>
                      <span>{selectedLand.shares.toString()}%</span>
                    </div>
                    {/* ))} */}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded shadow mb-4">
                <h3 className="font-medium mb-3 text-gray-700">IPFS Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:bg-gray-100"
                    onClick={() => viewIPFSContent(selectedLand.ownershipHistoryHash)}
                  >
                    <span>Ownership History</span>
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>

                  <button
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:bg-gray-100"
                    onClick={() => viewIPFSContent(selectedLand.legalDocumentsHash)}
                  >
                    <span>Legal Documents</span>
                    <FileText className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {ipfsContent && (
                <div className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">IPFS Content</h3>
                    <button
                      className="text-gray-500"
                      onClick={() => setIpfsContent(null)}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                  <pre className="bg-gray-50 p-3 rounded text-sm">
                    {ipfsContent}
                  </pre>
                </div>
              )}
              {
                <button className='bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 mt-4' onClick={() => mintNFT(selectedLand)}>
                  Mint NFT
                </button>
              }

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileText className="h-12 w-12 mb-2 text-gray-300" />
              <p>Select a land record to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Official;
