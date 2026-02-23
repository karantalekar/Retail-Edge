import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = ({ onScan }) => {
  const [data, setData] = useState("Not Found");

  return (
    <div>
      <BarcodeScannerComponent
        width={400}
        height={300}
        onUpdate={(err, result) => {
          if (result) {
            setData(result.text);
            onScan(result.text); // Send scanned code to parent
          } else {
            setData("Not Found");
          }
        }}
      />
      <p>Scanned Code: {data}</p>
    </div>
  );
};

export default BarcodeScanner;
