"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestMongoDB() {
  const [status, setStatus] = useState("Checking connection...");
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus("Testing connection...");
    setError(null);
    
    try {
      const response = await fetch("/api/test-mongodb");
      const data = await response.json();
      
      if (response.ok) {
        setStatus("Connection successful! " + data.message);
      } else {
        setStatus("Connection failed");
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      setStatus("Connection error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <Card className="p-6 max-w-md w-full bg-black/40 backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">MongoDB Connection Test</h2>
        <div className="mb-4">
          <p className="text-white mb-2">Status: {status}</p>
          {error && (
            <p className="text-red-500 mt-2 p-2 bg-red-500/10 rounded">{error}</p>
          )}
        </div>
        <Button onClick={testConnection} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          Test Again
        </Button>
      </Card>
    </div>
  );
}
