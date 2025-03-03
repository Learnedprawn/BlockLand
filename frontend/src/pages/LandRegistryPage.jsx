import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Info, User, Users, Check, X, Home, File, FileText, DollarSign, Upload } from 'lucide-react';
import { pinata } from '../utils/config';
import LandRegistry from "../../../out/LandRegistry.sol/LandRegistry.json"

const LandRegistryPage = () => {
  const [ownership, setOwnership] = useState(null);
  const [contract, setContract] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    landAddress: '',
    ownerName: '',
    ownerNames: [''],
    ownerAddress: '',
    ownerAddresses: [''],
    shares: [],
    legalDocumentsHash: '',
    ownershipHistoryHash: '',
    price: 0
  });

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
      setContract(contractInstance);
    }
  }, []);


  const [documents, setDocuments] = useState({
    legalDocument: null,
    ownershipHistory: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  const handleOwnershipSelection = (type) => {
    setOwnership(type);

    if (type === "single")
      setFormData(prev => ({
        ...prev,
        shares: [100]
      }));
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'ownerAddress') {
      setFormData(prev => ({
        ...prev,
        ownerAddresses: [value]
      }));
    }
    if (name === "ownerName") {
      setFormData(prev => ({
        ...prev,
        ownerNames: [value]
      }));
    }
  };

  const handleArrayInputChange = (index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const [legalDocumentBase64, setLegalDocumentBase64] = useState(null);
  const [ownershipHistoryBase64, setOwnershipHistoryBase64] = useState(null);
  //new new
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setDocuments(prev => ({
        ...prev,
        [name]: files[0]
      }));

      const reader = new FileReader();

      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        if (name === 'legalDocument') {
          setLegalDocumentBase64(reader.result);

        } else if (name === 'ownershipHistory') {
          setOwnershipHistoryBase64(reader.result)
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
    }
  };

  const uploadToIPFS = async (base64Data, fileName, type) => {
    setUploadingDocuments(true);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    // Create a new FormData object to send file data in multipart/form-data format
    const formData = new FormData();

    // Append the file data and metadata to the form
    formData.append("file", base64ToBlob(base64Data), fileName);

    const metadata = JSON.stringify({
      name: fileName,
    });

    formData.append("pinataMetadata", metadata);
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`, // JWT token from Pinata
      },
      body: formData, // Send formData
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${result.error}`);
    }
    setUploadingDocuments(false);
    if (type === "legalDocument") {
      setFormData((prev) => ({ ...prev, legalDocumentsHash: result.IpfsHash }));
    }
    else if (type === "ownershipHistory") {
      setFormData((prev) => ({ ...prev, ownershipHistoryHash: result.IpfsHash }));
    }
    return result.IpfsHash; // Return IPFS hash of the uploaded file
  };

  const base64ToBlob = (base64Data) => {
    const byteCharacters = atob(base64Data.split(",")[1]); // Decode base64 data
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/octet-stream" });
  };


  const addOwner = () => {
    setFormData(prev => ({
      ...prev,
      ownerNames: [...prev.ownerNames, ''],
      ownerAddresses: [...prev.ownerAddresses, ''],
      shares: [...prev.shares, '']
    }));
  };

  const removeOwner = (index) => {
    if (formData.ownerNames.length <= 1) return;

    setFormData(prev => {
      const newOwnerNames = [...prev.ownerNames];
      const newOwnerAddresses = [...prev.ownerAddresses];
      const newShares = [...prev.shares];

      newOwnerNames.splice(index, 1);
      newOwnerAddresses.splice(index, 1);
      newShares.splice(index, 1);

      return {
        ...prev,
        ownerNames: newOwnerNames,
        ownerAddresses: newOwnerAddresses,
        shares: newShares
      };
    });
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);


    const tx = await contract.registerLand(formData.ownerNames, formData.price, formData.landAddress, formData.ownershipHistoryHash, formData.legalDocumentsHash, formData.ownerAddresses, formData.shares);

    await tx.wait();

    setIsSubmitting(false);
    setStep(4)

  };

  const resetForm = () => {
    setOwnership(null);
    setStep(1);
    setFormData({
      landAddress: '',
      ownerName: '',
      ownerNames: [''],
      ownerAddress: '',
      ownerAddresses: [''],
      shares: [''],
      legalDocumentsHash: '',
      ownershipHistoryHash: '',
      price: ''
    });
    setDocuments({
      legalDocument: null,
      ownershipHistory: null
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Home className="mr-2" /> Land Registry System
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">

            {/* Progress Tracker */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
                    1
                  </div>
                  <span className="text-sm mt-1">Type</span>
                </div>
                <div className={`flex-grow border-t-2 mx-4 ${step >= 2 ? 'border-indigo-600' : 'border-gray-300'}`}></div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
                    2
                  </div>
                  <span className="text-sm mt-1">Details</span>
                </div>
                <div className={`flex-grow border-t-2 mx-4 ${step >= 3 ? 'border-indigo-600' : 'border-gray-300'}`}></div>
                <div className={`flex flex-col items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 3 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
                    3
                  </div>
                  <span className="text-sm mt-1">Review</span>
                </div>
                <div className={`flex-grow border-t-2 mx-4 ${step >= 4 ? 'border-indigo-600' : 'border-gray-300'}`}></div>
                <div className={`flex flex-col items-center ${step >= 4 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 4 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
                    4
                  </div>
                  <span className="text-sm mt-1">Complete</span>
                </div>
              </div>
            </div>

            {/* Step 1: Ownership Type Selection */}
            {step === 1 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-6">Select Land Ownership Type</h2>
                <p className="text-gray-600 mb-8">Is the land owned by a single user or multiple users?</p>

                <div className="flex justify-center space-x-6">
                  <button
                    onClick={() => handleOwnershipSelection('single')}
                    className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  >
                    <User size={64} className="text-indigo-600 mb-4" />
                    <span className="text-lg font-medium">Single Owner</span>
                  </button>

                  <button
                    onClick={() => handleOwnershipSelection('multiple')}
                    className="flex flex-col items-center p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  >
                    <Users size={64} className="text-indigo-600 mb-4" />
                    <span className="text-lg font-medium">Multiple Owners</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Property & Owner Details */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Enter Property Details</h2>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="landAddress">
                    Property Address
                  </label>
                  <textarea
                    id="landAddress"
                    name="landAddress"
                    rows="3"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter complete property address"
                    value={formData.landAddress}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                    Property Value (ETH)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.001"
                      name="price"
                      id="price"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">Document Uploads</h3>

                  <div className="space-y-6">
                    {/* Land Legal Documents Upload */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-base font-medium text-gray-900">Land Legal Documents</h4>
                          <p className="text-sm text-gray-500 mb-3">
                            Upload official property deed, survey documents, and any legal certificates.
                          </p>

                          <div className="mt-1 flex items-center">
                            <div className="relative flex-grow">
                              <input
                                id="legalDocument"
                                name="legalDocument"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                              <label
                                htmlFor="legalDocument"
                                className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 inline-flex items-center"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Select File
                              </label>
                              <span className="ml-3 text-gray-500 text-sm">
                                {documents.legalDocument ? documents.legalDocument.name : 'No file chosen'}
                              </span>
                            </div>

                            {documents.legalDocument && (
                              <button
                                type="button"
                                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                onClick={() => uploadToIPFS(legalDocumentBase64, documents.legalDocument.name, 'legalDocument')}
                                disabled={uploadingDocuments}
                              >
                                {uploadingDocuments ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                  </span>
                                ) : "Upload"}
                              </button>
                            )}
                          </div>

                          <div id="legal-upload-success" className="mt-2 text-sm text-green-600 hidden">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              File uploaded successfully! IPFS hash: {formData.legalDocumentsHash.substring(0, 12)}...
                            </div>
                          </div>

                          <input
                            type="text"
                            name="legalDocumentsHash"
                            className="mt-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Or enter IPFS hash directly"
                            value={formData.legalDocumentsHash}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Land Ownership History Upload */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <File className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-base font-medium text-gray-900">Ownership History Documents</h4>
                          <p className="text-sm text-gray-500 mb-3">
                            Upload documents showing previous ownership transfers, title history, and related records.
                          </p>

                          <div className="mt-1 flex items-center">
                            <div className="relative flex-grow">
                              <input
                                id="ownershipHistory"
                                name="ownershipHistory"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                              <label
                                htmlFor="ownershipHistory"
                                className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 inline-flex items-center"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Select File
                              </label>
                              <span className="ml-3 text-gray-500 text-sm">
                                {documents.ownershipHistory ? documents.ownershipHistory.name : 'No file chosen'}
                              </span>
                            </div>

                            {documents.ownershipHistory && (
                              <button
                                type="button"
                                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                onClick={() => uploadToIPFS(ownershipHistoryBase64, documents.ownershipHistory.name, 'ownershipHistory')}
                                disabled={uploadingDocuments}
                              >
                                {uploadingDocuments ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                  </span>
                                ) : "Upload"}
                              </button>
                            )}
                          </div>

                          <div id="history-upload-success" className="mt-2 text-sm text-green-600 hidden">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              File uploaded successfully! IPFS hash: {formData.ownershipHistoryHash.substring(0, 12)}...
                            </div>
                          </div>

                          <input
                            type="text"
                            name="ownershipHistoryHash"
                            className="mt-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Or enter IPFS hash directly"
                            value={formData.ownershipHistoryHash}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4">
                    {ownership === 'single' ? 'Owner Information' : 'Multiple Owners Information'}
                  </h3>

                  {ownership === 'single' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm mb-1" htmlFor="ownerName">
                          Owner Name
                        </label>
                        <input
                          type="text"
                          name="ownerName"
                          id="ownerName"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Full legal name"
                          value={formData.ownerName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm mb-1" htmlFor="ownerAddress">
                          Ethereum Address
                        </label>
                        <input
                          type="text"
                          name="ownerAddress"
                          id="ownerAddress"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="0x..."
                          value={formData.ownerAddress}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      {formData.ownerNames.map((_, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-md mb-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Owner #{index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeOwner(index)}
                              className="text-red-500 hover:text-red-700"
                              disabled={formData.ownerNames.length <= 1}
                            >
                              <X size={20} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-gray-700 text-sm mb-1">
                                Owner Name
                              </label>
                              <input
                                type="text"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Full legal name"
                                value={formData.ownerNames[index]}
                                onChange={(e) => handleArrayInputChange(index, 'ownerNames', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm mb-1">
                                Ethereum Address
                              </label>
                              <input
                                type="text"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="0x..."
                                value={formData.ownerAddresses[index]}
                                onChange={(e) => handleArrayInputChange(index, 'ownerAddresses', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 text-sm mb-1">
                                Ownership Share (%)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Percentage"
                                value={formData.shares[index]}
                                onChange={(e) => handleArrayInputChange(index, 'shares', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addOwner}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                      >
                        + Add Another Owner
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Review Information
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Review Registration Information</h2>

                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-bold text-lg mb-2">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Property Address:</p>
                      <p className="mb-2">{formData.landAddress || 'Not provided'}</p>

                      <p className="text-sm text-gray-500">Property Value:</p>
                      <p className="mb-2">{formData.price ? `${formData.price} ETH` : 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Legal Documents Hash:</p>
                      <p className="mb-2 truncate">{formData.legalDocumentsHash || 'Not provided'}</p>

                      <p className="text-sm text-gray-500">Ownership History Hash:</p>
                      <p className="truncate">{formData.ownershipHistoryHash || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-bold text-lg mb-2">
                    {ownership === 'single' ? 'Owner Information' : 'Multiple Owners Information'}
                  </h3>

                  {ownership === 'single' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Owner Name:</p>
                        <p className="mb-2">{formData.ownerName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ethereum Address:</p>
                        <p className="font-mono truncate">{formData.ownerAddress || 'Not provided'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.ownerNames.map((name, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3">
                          <h4 className="font-medium mb-2">Owner #{index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Name:</p>
                              <p>{name || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ethereum Address:</p>
                              <p className="font-mono truncate">{formData.ownerAddresses[index] || 'Not provided'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ownership Share:</p>
                              <p>{formData.shares[index] ? `${formData.shares[index]}%` : 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Register Land"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Completion */}
            {step === 4 && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">Registration Submitted Successfully</h2>
                <p className="text-gray-600 mb-6">
                  Your land registration has been submitted to the blockchain. The transaction may take a few minutes to be confirmed.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block text-left">
                  <p className="mb-2">
                    <span className="font-medium">Transaction Hash:</span>
                    <span className="ml-2 font-mono text-sm">0x3a4e98b7d0c37ea9b606b4456a5b77c12c5ceb4e5782c574f319ac3c69c5d524</span>
                  </p>
                  <p>
                    <span className="font-medium">Registration ID:</span>
                    <span className="ml-2">{landCounter + 1}</span>
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Register Another Property
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandRegistryPage;