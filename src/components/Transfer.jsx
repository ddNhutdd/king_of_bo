import React from "react";
import TransferChild from "./TransferChild";
import TransferHistory from "./TransferHistory";

export default function Transfer() {
  return (
    <div className="transfer">
      <TransferChild />
      <div className="divider" style={{ marginBottom: 30 }}></div>
      <TransferHistory />
    </div>
  );
}
