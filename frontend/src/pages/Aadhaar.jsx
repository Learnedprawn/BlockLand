import React, { useState, useEffect } from 'react';
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import Enrollment from "../../../out/Enrollment.sol/Enrollment.json";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const Aadhaar = ({ setUseTestAadhaar, useTestAadhaar }) => {
  const navigate = useNavigate();
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  const [userName, setUserName] = useState("");
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected === false) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a new contract instance with the signer
      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_ENROLLMENT_CONTRACT_ADDRESS,
        // "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        Enrollment.abi,
        signer
      );
      setContract(contractInstance);
    }
  }, []);
  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      console.log(anonAadhaar.status);
    }
  }, [anonAadhaar]);

  const switchAadhaar = () => {
    setUseTestAadhaar(!useTestAadhaar);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsNameSubmitted(true);
    }
  };

  const enroll = async () => {
    setLoading(true);
    if (id === "user") {
      try {
        const tx = await contract.enrollUser(userName, JSON.stringify(latestProof.proof.nullifier, null, 2), JSON.stringify(latestProof.proof.ageAbove18, null, 2), JSON.stringify(latestProof.proof.gender, null, 2), JSON.stringify(latestProof.proof.pincode, null, 2), JSON.stringify(latestProof.proof.state, null, 2));

        await tx.wait();
        setLoading(false);
        navigate("/user");
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const tx = await contract.enrollGovernmentOfficial(userName, JSON.stringify(latestProof.proof.nullifier, null, 2), JSON.stringify(latestProof.proof.ageAbove18, null, 2), JSON.stringify(latestProof.proof.gender, null, 2), JSON.stringify(latestProof.proof.pincode, null, 2), JSON.stringify(latestProof.proof.state, null, 2));

        await tx.wait();
        setLoading(false);
        navigate("/official");
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 px-4 py-8">
      <main className="flex flex-col items-center gap-6 bg-white rounded-2xl max-w-screen-sm mx-auto shadow-xl p-8 border border-indigo-100">
        <div className="text-center">
          <h1 className="font-bold text-3xl text-indigo-800 mb-2">Anonymous Identity Verification</h1>
          <p className="text-gray-600">Prove your identity anonymously using your Aadhaar card</p>
        </div>

        {!isNameSubmitted ? (
          <div className="w-full max-w-md mt-4">
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-center text-indigo-800">
                Welcome, <span className="font-semibold">{userName}</span>! Please verify your identity below.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <LogInWithAnonAadhaar
                nullifierSeed={1234}
                fieldsToReveal={["revealAgeAbove18", "revealGender", "revealPinCode", "revealState"]}
              />
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <p>
                {useTestAadhaar ? (
                  <span>You're using <strong className="text-amber-600">test</strong> Aadhaar mode</span>
                ) : (
                  <span>You're using <strong className="text-green-600">real</strong> Aadhaar mode</span>
                )}
              </p>
              <button
                onClick={switchAadhaar}
                type="button"
                className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
              >
                Switch to {useTestAadhaar ? "real" : "test"}
              </button>
            </div>
          </div>
        )}
      </main>

      {anonAadhaar.status === "logged-in" && (
        <div className="flex flex-col items-center gap-4 bg-white rounded-2xl max-w-screen-sm mx-auto mt-6 p-8 shadow-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Verification Successful</span>
          </div>

          <p className="text-gray-700 text-center">
            Hello {userName}, your anonymous identity has been verified!
          </p>

          {latestProof && (
            <div className="w-full mt-4">
              <p className="text-sm text-gray-600 mb-2">Proof Details:</p>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-48">
                <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
              </div>
              <button
                onClick={enroll}
                className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >

                <span className="text-lg font-medium text-gray-800">ENROLL</span>

              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Aadhaar;