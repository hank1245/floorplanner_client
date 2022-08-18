import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { QueryClientProvider, QueryClient } from "react-query";
import Draw from "./pages/Draw";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/draw/:draftId" element={<Draw />} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
