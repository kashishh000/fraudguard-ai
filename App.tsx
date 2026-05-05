import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, CreditCard, Crosshair, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const generateTx = (id: number, isFraud: boolean) => {
  const merchants = ['Amazon', 'Starbucks', 'Uber', 'Netflix', 'Walmart', 'Apple Store'];
  const locations = ['New York, US', 'London, UK', 'Toronto, CA', 'Sydney, AU'];
  
  if (isFraud) {
    return { id: `TX-${id}`, amount: (Math.random() * 5000 + 1000).toFixed(2), merchant: 'DarkWeb Crypto Exch.', location: 'Moscow, RU', status: 'FRAUD', time: new Date().toLocaleTimeString() };
  }
  return { id: `TX-${id}`, amount: (Math.random() * 150 + 5).toFixed(2), merchant: merchants[Math.floor(Math.random() * merchants.length)], location: locations[Math.floor(Math.random() * locations.length)], status: 'APPROVED', time: new Date().toLocaleTimeString() };
};

function App() {
  const [transactions, setTransactions] = useState<any[]>([
    generateTx(1001, false), generateTx(1002, false), generateTx(1003, false)
  ]);
  const [fraudAlert, setFraudAlert] = useState<any>(null);
  const [totalScanned, setTotalScanned] = useState(3);
  const [blocked, setBlocked] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (fraudAlert) return; // Pause if alert is active

      setTotalScanned(prev => prev + 1);
      const isFraud = Math.random() < 0.05; // 5% chance
      const newTx = generateTx(1000 + totalScanned + 1, isFraud);
      
      setTransactions(prev => [newTx, ...prev].slice(0, 10)); // Keep last 10

      if (isFraud) {
        setFraudAlert(newTx);
        setBlocked(prev => prev + 1);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [totalScanned, fraudAlert]);

  return (
    <div className="dashboard">
      <header className="header">
        <div className="brand"><ShieldCheck size={28} color="#3b82f6" /> FraudGuard AI</div>
        <div className="metrics-bar">
          <div className="metric">
            <div className="metric-label">Transactions Scanned</div>
            <div className="metric-value">{totalScanned.toLocaleString()}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Fraud Prevented</div>
            <div className="metric-value" style={{color:'#ef4444'}}>${(blocked * 2500).toLocaleString()}</div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="card">
          <div className="card-title"><Activity size={18}/> Live Transaction Stream (Global)</div>
          <div className="tx-list">
            <div className="tx-row" style={{background:'transparent', color:'var(--text-muted)', border:'none', paddingBottom:'0.5rem', borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              <div>TX ID</div><div>MERCHANT</div><div>LOCATION</div><div>AMOUNT</div><div>STATUS</div>
            </div>
            <AnimatePresence>
              {transactions.map(tx => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`tx-row ${tx.status === 'FRAUD' ? 'fraud' : ''}`}
                >
                  <div style={{color:'var(--text-muted)'}}>{tx.id}</div>
                  <div>{tx.merchant}</div>
                  <div>{tx.location}</div>
                  <div>${tx.amount}</div>
                  <div>
                    <span className={`badge ${tx.status === 'FRAUD' ? 'danger' : 'safe'}`}>
                      {tx.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="card">
          <div className="card-title"><ShieldAlert size={18}/> Neural Network Assessment</div>
          <div className="network-container">
            {!fraudAlert ? (
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <div className="pulsing-brain"><Crosshair size={64} /></div>
                <h3 style={{color:'var(--success)', textAlign:'center'}}>System Secure.<br/>Monitoring Stream...</h3>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fraud-alert">
                <AlertTriangle size={48} color="#ef4444" style={{marginBottom:'1rem'}} />
                <h2 style={{color:'#ef4444', marginBottom:'0.5rem'}}>CRITICAL FRAUD DETECTED</h2>
                <p style={{color:'#f1f5f9', marginBottom:'1rem', lineHeight:1.5}}>
                  <strong>AI Analysis:</strong> Geographic anomaly detected. Card used in {fraudAlert.location} less than 2 hours after a physical swipe in New York. Amount (${fraudAlert.amount}) deviates 400% from user's historical baseline.
                </p>
                <div style={{background:'rgba(0,0,0,0.5)', padding:'1rem', borderRadius:'8px', fontFamily:'monospace', color:'#3b82f6', marginBottom:'1.5rem'}}>
                  Action Taken: <span style={{color:'#ef4444'}}>Transaction Declined. Card Frozen.</span>
                </div>
                <button 
                  onClick={() => setFraudAlert(null)}
                  style={{width:'100%', padding:'1rem', background:'#ef4444', color:'white', border:'none', borderRadius:'8px', fontWeight:700, cursor:'pointer'}}
                >
                  Resolve & Resume Monitoring
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
