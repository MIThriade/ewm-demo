import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, Eye, ShoppingCart, Check, ArrowRight, Layers, Lightbulb, Volume2, Download, Camera, Send, Grid3x3, Move } from 'lucide-react';

const ConfiguratorPremium = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    room: 'living',
    riflaje: { type: 'pvc', color: 'warm-oak', coverage: 50 },
    acoustic: { 
      count: 6, 
      pattern: 'hexagon', 
      color: 'charcoal',
      layout: [
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 1, y: 0 },
        { id: 3, x: 2, y: 0 },
        { id: 4, x: 0, y: 1 },
        { id: 5, x: 1, y: 1 },
        { id: 6, x: 2, y: 1 }
      ]
    },
    lighting: { type: 'strip', cct: 3000, brightness: 80 }
  });
  const [preview, setPreview] = useState('front');
  const [particles, setParticles] = useState([]);
  const [draggedPanel, setDraggedPanel] = useState(null);
  const [showAR, setShowAR] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [isDraggingMode, setIsDraggingMode] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);

  // Calculare preț dinamic
  const calculatePrice = () => {
    let base = 0;
    base += config.riflaje.type === 'pvc' ? 350 : 480;
    base += (config.riflaje.coverage / 10) * 45;
    base += config.acoustic.count * 85;
    const ledPrices = { strip: 280, pendant: 420, panel: 650 };
    base += ledPrices[config.lighting.type] || 0;
    return Math.round(base);
  };

  // Particle effect
  const createParticle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setParticles(prev => [...prev, { id, x, y }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1000);
  };

  // AR Camera access
  const startAR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowAR(true);
      }
    } catch (err) {
      alert('Camera nu este disponibilă. Verifică permisiunile browser-ului.');
    }
  };

  const stopAR = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowAR(false);
  };

  // Drag & Drop pentru panouri
  const handleDragStart = (e, panelId) => {
    setDraggedPanel(panelId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetX, targetY) => {
    e.preventDefault();
    if (!draggedPanel) return;

    const newLayout = config.acoustic.layout.map(panel => {
      if (panel.id === draggedPanel) {
        return { ...panel, x: targetX, y: targetY };
      }
      // Swap dacă poziția e ocupată
      if (panel.x === targetX && panel.y === targetY) {
        const draggedPos = config.acoustic.layout.find(p => p.id === draggedPanel);
        return { ...panel, x: draggedPos.x, y: draggedPos.y };
      }
      return panel;
    });

    setConfig({
      ...config,
      acoustic: { ...config.acoustic, layout: newLayout }
    });
    setDraggedPanel(null);
  };

  // Export ca PNG
  const exportAsPNG = async () => {
    if (!previewRef.current) return;
    
    try {
      // Creăm un canvas temporar
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const rect = previewRef.current.getBoundingClientRect();
      
      canvas.width = 1200;
      canvas.height = 900;
      
      // Background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Riflaje background
      const riflajColor = colors.find(c => c.id === config.riflaje.color)?.hex || '#C19A6B';
      ctx.fillStyle = riflajColor + '20';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Panouri acustice
      const panelColor = colors.find(c => c.id === config.acoustic.color)?.hex || '#36454F';
      const gridSize = 3;
      const panelSize = 120;
      const gap = 30;
      const startX = (canvas.width - (gridSize * panelSize + (gridSize - 1) * gap)) / 2;
      const startY = (canvas.height - (gridSize * panelSize + (gridSize - 1) * gap)) / 2;
      
      config.acoustic.layout.forEach(panel => {
        const x = startX + panel.x * (panelSize + gap);
        const y = startY + panel.y * (panelSize + gap);
        
        ctx.fillStyle = panelColor;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;
        ctx.roundRect(x, y, panelSize, panelSize, 15);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      // LED glow
      const gradient = ctx.createLinearGradient(0, canvas.height - 50, canvas.width, canvas.height - 50);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.5, `rgba(255,235,160,${config.lighting.brightness / 150})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
      
      // Info overlay
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.roundRect(30, canvas.height - 150, canvas.width - 60, 100, 20);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Inter';
      ctx.fillText('EWM Home Configurator', 50, canvas.height - 110);
      
      ctx.font = '18px Inter';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${config.acoustic.count} panouri · ${riflajeMaterials.find(m => m.id === config.riflaje.type)?.label} · ${lightingTypes.find(l => l.id === config.lighting.type)?.label}`, 50, canvas.height - 80);
      
      ctx.font = 'bold 32px Inter';
      ctx.fillStyle = '#00d4ff';
      ctx.fillText(`${calculatePrice()} Lei`, canvas.width - 200, canvas.height - 85);
      
      // Download
      const link = document.createElement('a');
      link.download = `ewm-config-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setShowExportMenu(false);
    } catch (err) {
      console.error('Export PNG failed:', err);
      alert('Eroare la export PNG');
    }
  };

  // Export ca PDF (JSON structurat)
  const exportAsPDF = () => {
    const configData = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        total: calculatePrice()
      },
      configuration: {
        room: config.room,
        riflaje: {
          type: config.riflaje.type,
          color: colors.find(c => c.id === config.riflaje.color)?.label,
          coverage: config.riflaje.coverage
        },
        acoustic: {
          count: config.acoustic.count,
          pattern: config.acoustic.pattern,
          color: colors.find(c => c.id === config.acoustic.color)?.label,
          layout: config.acoustic.layout
        },
        lighting: {
          type: lightingTypes.find(l => l.id === config.lighting.type)?.label,
          cct: config.lighting.cct,
          brightness: config.lighting.brightness
        }
      }
    };
    
    // Creăm PDF-like text file
    const pdfContent = `
═══════════════════════════════════════════════════════
            EWM HOME - CONFIGURAȚIE COMANDĂ
═══════════════════════════════════════════════════════

Data: ${new Date().toLocaleDateString('ro-RO')}
ID Configurație: ${Date.now()}

───────────────────────────────────────────────────────
SPAȚIU
───────────────────────────────────────────────────────
Tip cameră: ${rooms.find(r => r.id === config.room)?.label}

───────────────────────────────────────────────────────
RIFLAJE
───────────────────────────────────────────────────────
Material: ${riflajeMaterials.find(m => m.id === config.riflaje.type)?.label}
Culoare: ${colors.find(c => c.id === config.riflaje.color)?.label}
Acoperire: ${config.riflaje.coverage}%

───────────────────────────────────────────────────────
PANOURI ACUSTICE
───────────────────────────────────────────────────────
Număr: ${config.acoustic.count} bucăți
Pattern: ${acousticPatterns.find(p => p.id === config.acoustic.pattern)?.label}
Culoare: ${colors.find(c => c.id === config.acoustic.color)?.label}

───────────────────────────────────────────────────────
ILUMINARE LED
───────────────────────────────────────────────────────
Tip: ${lightingTypes.find(l => l.id === config.lighting.type)?.label}
Temperatură: ${config.lighting.cct}K
Intensitate: ${config.lighting.brightness}%

═══════════════════════════════════════════════════════
                    TOTAL: ${calculatePrice()} LEI
═══════════════════════════════════════════════════════

Pentru comenzi: contact@ewmhome.ro | +40 123 456 789
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `EWM-Configuratie-${Date.now()}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    
    setShowExportMenu(false);
  };

  // Backend Integration (Mock)
  const submitOrder = async () => {
    setOrderStatus('processing');
    
    try {
      // Simulăm un API call real
      const orderData = {
        configuration: config,
        price: calculatePrice(),
        timestamp: new Date().toISOString(),
        customer: {
          // În producție, aici ar veni date din formular
          email: 'demo@ewmhome.ro'
        }
      };
      
      // Mock API endpoint
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        setOrderStatus('success');
        setTimeout(() => setOrderStatus(null), 5000);
      } else {
        throw new Error('Order failed');
      }
    } catch (err) {
      setOrderStatus('error');
      setTimeout(() => setOrderStatus(null), 5000);
    }
  };

  const rooms = [
    { id: 'living', label: 'Living', icon: '🛋️', gradient: 'from-blue-500 to-purple-500' },
    { id: 'office', label: 'Birou', icon: '💼', gradient: 'from-green-500 to-teal-500' },
    { id: 'studio', label: 'Studio', icon: '🎙️', gradient: 'from-orange-500 to-red-500' }
  ];

  const riflajeMaterials = [
    { id: 'pvc', label: 'PVC Premium', texture: 'linear-gradient(135deg, #8B7355 0%, #6B5344 100%)' },
    { id: 'mdf', label: 'MDF Luxury', texture: 'linear-gradient(135deg, #4A3728 0%, #3A2718 100%)' }
  ];

  const colors = [
    { id: 'warm-oak', label: 'Stejar cald', hex: '#C19A6B' },
    { id: 'walnut', label: 'Nuc închis', hex: '#5C4033' },
    { id: 'white-oak', label: 'Stejar alb', hex: '#E8D5C4' },
    { id: 'charcoal', label: 'Cărbune', hex: '#36454F' }
  ];

  const acousticPatterns = [
    { id: 'hexagon', label: 'Hexagon', preview: '⬢' },
    { id: 'wave', label: 'Wave', preview: '〰️' },
    { id: 'grid', label: 'Grid', preview: '▦' }
  ];

  const lightingTypes = [
    { id: 'strip', label: 'Bandă LED', icon: '💡', desc: 'Ambient perimetral' },
    { id: 'pendant', label: 'Lustră LED', icon: '🔆', desc: 'Statement piece' },
    { id: 'panel', label: 'Panou LED', icon: '▭', desc: 'Difuzie uniformă' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg">EWM Configurator PRO</div>
              <div className="text-xs text-slate-400">AR · Export · Real-time</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step >= s 
                    ? 'bg-gradient-to-br from-cyan-400 to-purple-600 border-transparent shadow-lg shadow-cyan-500/30' 
                    : 'border-slate-700 bg-slate-800/50'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm ${step >= s ? 'text-white' : 'text-slate-500'}`}>
                  {s === 1 ? 'Spațiu' : s === 2 ? 'Design' : 'Finisare'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xs text-slate-400">Total estimat</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {calculatePrice()} Lei
              </div>
            </div>
            
            {/* Export Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
              >
                <Download className="w-5 h-5" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 top-14 bg-slate-800 border border-slate-700 rounded-xl p-2 min-w-[200px] shadow-xl">
                  <button 
                    onClick={exportAsPNG}
                    className="w-full px-4 py-2 text-left rounded-lg hover:bg-slate-700 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export PNG
                  </button>
                  <button 
                    onClick={exportAsPDF}
                    className="w-full px-4 py-2 text-left rounded-lg hover:bg-slate-700 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Detalii
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={showAR ? stopAR : startAR}
              className={`p-3 rounded-xl border transition-all ${
                showAR 
                  ? 'bg-red-500 border-red-400' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Camera className="w-5 h-5" />
            </button>
            
            <button 
              onClick={submitOrder}
              disabled={orderStatus === 'processing'}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              {orderStatus === 'processing' ? 'Se trimite...' : 'Comandă'}
            </button>
          </div>
        </div>
      </div>

      {/* Order Status Toast */}
      {orderStatus && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-xl border shadow-lg animate-in slide-in-from-top ${
          orderStatus === 'success' 
            ? 'bg-green-500/20 border-green-500/50' 
            : orderStatus === 'error'
            ? 'bg-red-500/20 border-red-500/50'
            : 'bg-blue-500/20 border-blue-500/50'
        }`}>
          {orderStatus === 'success' && '✅ Comandă trimisă cu succes!'}
          {orderStatus === 'error' && '❌ Eroare la trimitere'}
          {orderStatus === 'processing' && '⏳ Se procesează...'}
        </div>
      )}

      {/* AR Overlay */}
      {showAR && (
        <div className="fixed inset-0 z-40 bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-4">📐</div>
              <h3 className="text-2xl font-bold mb-2">Vizualizare AR</h3>
              <p className="text-slate-300 mb-4">Îndreaptă camera spre perete</p>
              <div className="text-sm text-slate-400">
                {config.acoustic.count} panouri · {colors.find(c => c.id === config.acoustic.color)?.label}
              </div>
            </div>
          </div>
          <button 
            onClick={stopAR}
            className="absolute top-6 right-6 px-6 py-3 bg-red-500 rounded-xl font-semibold"
          >
            Închide AR
          </button>
        </div>
      )}

      <div className="pt-24 pb-12 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* PREVIEW CANVAS */}
          <div className="sticky top-24">
            <div className="relative">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                {['front', '3d', 'detail'].map(view => (
                  <button
                    key={view}
                    onClick={() => setPreview(view)}
                    className={`px-4 py-2 rounded-lg backdrop-blur-xl border transition-all ${
                      preview === view
                        ? 'bg-white/20 border-white/30 shadow-lg'
                        : 'bg-black/20 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {view === 'front' ? '2D' : view === '3d' ? '3D' : '📐'}
                  </button>
                ))}
                
                <button
                  onClick={() => setIsDraggingMode(!isDraggingMode)}
                  className={`px-4 py-2 rounded-lg backdrop-blur-xl border transition-all ${
                    isDraggingMode
                      ? 'bg-cyan-500/20 border-cyan-400/50'
                      : 'bg-black/20 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Move className="w-4 h-4" />
                </button>
              </div>

              <div 
                ref={previewRef}
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]"
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                <div className="relative h-full flex items-center justify-center p-12">
                  <div 
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${colors.find(c => c.id === config.riflaje.color)?.hex}15 0%, ${colors.find(c => c.id === config.riflaje.color)?.hex}05 100%)`,
                      transform: preview === '3d' ? 'perspective(1000px) rotateY(-15deg)' : 'none'
                    }}
                  >
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, ${colors.find(c => c.id === config.riflaje.color)?.hex} 0px, transparent 2px, transparent ${100/config.riflaje.coverage * 2}px)`
                    }} />
                  </div>

                  {/* Drag & Drop Grid */}
                  <div className="relative z-10">
                    {isDraggingMode ? (
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 9 }).map((_, idx) => {
                          const gridX = idx % 3;
                          const gridY = Math.floor(idx / 3);
                          const panel = config.acoustic.layout.find(p => p.x === gridX && p.y === gridY);
                          
                          return (
                            <div
                              key={idx}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, gridX, gridY)}
                              className={`w-20 h-20 rounded-xl border-2 border-dashed transition-all ${
                                panel ? 'border-transparent' : 'border-slate-600 bg-slate-800/20'
                              }`}
                            >
                              {panel && (
                                <div
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, panel.id)}
                                  className="w-full h-full rounded-xl cursor-move transition-all hover:scale-110 flex items-center justify-center text-xl"
                                  style={{
                                    background: colors.find(c => c.id === config.acoustic.color)?.hex,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                  }}
                                >
                                  {acousticPatterns.find(p => p.id === config.acoustic.pattern)?.preview}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {config.acoustic.layout.slice(0, config.acoustic.count).map((panel, i) => (
                          <div
                            key={panel.id}
                            className="w-16 h-16 rounded-xl transition-all duration-500 hover:scale-110"
                            style={{
                              background: colors.find(c => c.id === config.acoustic.color)?.hex,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                              gridColumn: panel.x + 1,
                              gridRow: panel.y + 1,
                              transform: preview === '3d' ? `translateZ(${20 + i * 5}px) rotateX(5deg)` : 'none',
                              animationDelay: `${i * 0.1}s`
                            }}
                          >
                            <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">
                              {acousticPatterns.find(p => p.id === config.acoustic.pattern)?.preview}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 blur-sm" 
                    style={{ 
                      filter: `hue-rotate(${(config.lighting.cct - 2700) / 10}deg)`,
                      opacity: config.lighting.brightness / 100 
                    }}
                  />

                  {config.lighting.type === 'pendant' && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-yellow-300/20 blur-3xl animate-pulse" />
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-slate-400">Riflaje</div>
                        <div className="font-semibold">{config.riflaje.coverage}%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-slate-400">Panouri</div>
                        <div className="font-semibold">{config.acoustic.count} buc</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <div>
                        <div className="text-slate-400">Lumină</div>
                        <div className="font-semibold">{config.lighting.cct}K</div>
                      </div>
                    </div>
                  </div>
                </div>

                {isDraggingMode && (
                  <div className="absolute top-4 left-4 bg-cyan-500/20 border border-cyan-400/50 rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-2">
                    <Move className="w-4 h-4" />
                    Mod Drag & Drop activ
                  </div>
                )}
              </div>

              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full pointer-events-none animate-ping"
                  style={{ left: p.x, top: p.y }}
                />
              ))}
            </div>
          </div>

          {/* CONTROLS */}
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <div>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Alege spațiul
                  </h2>
                  <p className="text-slate-400">Fiecare cameră are nevoile ei unice</p>
                </div>

                <div className="grid gap-4">
                  {rooms.map(room => (
                    <button
                      key={room.id}
                      onClick={() => setConfig({ ...config, room: room.id })}
                      onMouseEnter={createParticle}
                      className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                        config.room === room.id
                          ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${room.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className="relative flex items-center gap-4">
                        <div className="text-4xl">{room.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-xl">{room.label}</div>
                          <div className="text-sm text-slate-400">Optimizat pentru confort {room.id === 'studio' && '& acustică'}</div>
                        </div>
                        {config.room === room.id && <Check className="w-6 h-6 text-cyan-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Design & Materiale
                  </h2>
                  <button
                    onClick={() => setIsDraggingMode(!isDraggingMode)}
                    className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                      isDraggingMode
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    Aranjare
                  </button>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    Riflaje
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {riflajeMaterials.map(mat => (
                        <button
                          key={mat.id}
                          onClick={() => setConfig({ ...config, riflaje: { ...config.riflaje, type: mat.id }})}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            config.riflaje.type === mat.id
                              ? 'border-cyan-400 shadow-lg shadow-cyan-500/20'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <div className="h-12 rounded-lg mb-2" style={{ background: mat.texture }} />
                          <div className="text-sm font-semibold">{mat.label}</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {colors.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setConfig({ ...config, riflaje: { ...config.riflaje, color: color.id }})}
                          className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${
                            config.riflaje.color === color.id
                              ? 'border-white shadow-lg'
                              : 'border-slate-700'
                          }`}
                          style={{ background: color.hex }}
                          title={color.label}
                        />
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Acoperire</span>
                        <span className="font-bold text-cyan-400">{config.riflaje.coverage}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        step="10"
                        value={config.riflaje.coverage}
                        onChange={(e) => setConfig({ ...config, riflaje: { ...config.riflaje, coverage: parseInt(e.target.value) }})}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-purple-400" />
                    Panouri acustice
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {acousticPatterns.map(pat => (
                        <button
                          key={pat.id}
                          onClick={() => setConfig({ ...config, acoustic: { ...config.acoustic, pattern: pat.id }})}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            config.acoustic.pattern === pat.id
                              ? 'border-purple-400 shadow-lg shadow-purple-500/20'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          <div className="text-2xl mb-1">{pat.preview}</div>
                          <div className="text-xs">{pat.label}</div>
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Număr panouri</span>
                        <span className="font-bold text-purple-400">{config.acoustic.count}</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="9"
                        step="3"
                        value={config.acoustic.count}
                        onChange={(e) => {
                          const newCount = parseInt(e.target.value);
                          const newLayout = config.acoustic.layout.slice(0, newCount);
                          setConfig({ ...config, acoustic: { ...config.acoustic, count: newCount, layout: newLayout }});
                        }}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      {colors.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setConfig({ ...config, acoustic: { ...config.acoustic, color: color.id }})}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            config.acoustic.color === color.id
                              ? 'border-white scale-110'
                              : 'border-slate-700 hover:scale-105'
                          }`}
                          style={{ background: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Iluminare LED
                </h2>

                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-6">
                  <div className="grid gap-3">
                    {lightingTypes.map(light => (
                      <button
                        key={light.id}
                        onClick={() => setConfig({ ...config, lighting: { ...config.lighting, type: light.id }})}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                          config.lighting.type === light.id
                            ? 'border-yellow-400 bg-yellow-500/10 shadow-lg shadow-yellow-500/20'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="text-3xl">{light.icon}</div>
                        <div className="flex-1 text-left">
                          <div className="font-bold">{light.label}</div>
                          <div className="text-sm text-slate-400">{light.desc}</div>
                        </div>
                        {config.lighting.type === light.id && <Check className="w-5 h-5 text-yellow-400" />}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Temperatură culoare (CCT)</span>
                      <span className="font-bold text-yellow-400">{config.lighting.cct}K</span>
                    </div>
                    <input
                      type="range"
                      min="2700"
                      max="6500"
                      step="100"
                      value={config.lighting.cct}
                      onChange={(e) => setConfig({ ...config, lighting: { ...config.lighting, cct: parseInt(e.target.value) }})}
                      className="w-full accent-yellow-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Cald</span>
                      <span>Neutru</span>
                      <span>Rece</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Intensitate</span>
                      <span className="font-bold text-yellow-400">{config.lighting.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={config.lighting.brightness}
                      onChange={(e) => setConfig({ ...config, lighting: { ...config.lighting, brightness: parseInt(e.target.value) }})}
                      className="w-full accent-yellow-500"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-400/30">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl mb-1">Configurația ta</h3>
                      <p className="text-sm text-slate-400">Gata de comandă</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Total</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {calculatePrice()} Lei
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Riflaje {config.riflaje.type.toUpperCase()}</span>
                      <span>{colors.find(c => c.id === config.riflaje.color)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Panouri acustice</span>
                      <span>{config.acoustic.count} buc · {config.acoustic.pattern}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Iluminare</span>
                      <span>{lightingTypes.find(l => l.id === config.lighting.type)?.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-slate-800 rounded-xl font-semibold hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Înapoi
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all"
                >
                  Continuă
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={submitOrder}
                  disabled={orderStatus === 'processing'}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] transition-all animate-pulse disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {orderStatus === 'processing' ? 'Se trimite...' : `Trimite comandă - ${calculatePrice()} Lei`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ConfiguratorPremium;