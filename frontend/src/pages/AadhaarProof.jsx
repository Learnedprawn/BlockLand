import React,{ useEffect, useState } from 'react'
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import Aadhaar from './Aadhaar';

const AadhaarProof = () => {
  const [ready, setReady] = useState(false);
  const [useTestAadhaar, setUseTestAadhaar] = useState(false);

  useEffect(() => {
    setReady(true);
  } ,[]);
  return(
    <>
      {ready ? (
        <AnonAadhaarProvider
          _useTestAadhaar={useTestAadhaar}
          _appName="Anon Aadhaar"
        >

          <Aadhaar setUseTestAadhaar={setUseTestAadhaar} useTestAadhaar={useTestAadhaar} />
        </AnonAadhaarProvider>
      ) : null}
    </>
  )
}

export default AadhaarProof