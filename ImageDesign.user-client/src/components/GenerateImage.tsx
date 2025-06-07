import React, { useState, useEffect } from 'react';
import { Download, Zap, Sparkles, Camera } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState<number>(0);
  const baseURL = import.meta.env.VITE_API_URL

  const placeholderTexts = [
    'תמונה של כלב חמוד משחק בגינה...',
    'ילדה מחייכת עם פרחים בשיער...',
    'נוף הרים מדהים בשקיעה...',
    'חתול ישן על ספר פתוח...',
    'פרפר צבעוני על פרח אדום...',
    'ילד קורא ספר תחת עץ גדול...',
    'בית קטן ליד אגם שקט...',
    'עכבר קטן אוכל גבינה...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder(prev => (prev + 1) % placeholderTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('אנא הכנס תיאור לתמונה');
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch(`${baseURL}/Ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      
      const imageData = await response.text();
      setImageUrl(imageData);
    } catch (err) {
      setError('שגיאה ביצירת התמונה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!imageUrl) return;

    try {
      // שיטה חדשה להורדה - יצירת canvas וקישור ישיר
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ai-generated-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        // אם Canvas לא עובד, ננסה שיטה ישירה
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `ai-generated-${Date.now()}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      
      img.src = imageUrl;
      
    } catch (err) {
      console.error('Error downloading image:', err);
      // כפלן - פתיחה בחלון חדש
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-500 to-cyan-400" 
         style={{
           background: 'linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)'
         }}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-300/30 rounded-full blur-xl animate-bounce delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>


              
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">AI Image Studio</h1>
                <p className="text-sm text-white/80 font-medium">מחולל תמונות מתקדם עם בינה מלאכותית</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-sm text-white font-semibold">בחינם • ללא הגבלה</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden">
          
          {/* Hero Section */}
          <div className="px-12 pt-16 pb-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/30 shadow-2xl">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              צור תמונות מדהימות
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
              רק תכתוב מה שאתה רוצה לראות, והבינה המלאכותית תיצור עבורך יצירת אמנות ייחודית ומרהיבה
            </p>
          </div>

          {/* Input Section */}
          <div className="px-12 pb-8">
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-8">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={placeholderTexts[currentPlaceholder]}
                  rows={4}
                  className="w-full px-8 py-6 bg-white/15 backdrop-blur-sm border border-white/30 rounded-3xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white/20 transition-all duration-500 resize-none text-lg font-medium shadow-xl"
                  style={{
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                />
                <div className="absolute top-6 left-6">
                  <div className="flex items-center space-x-3 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-white font-semibold">מערכת AI פעילה</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleGenerateImage}
                disabled={loading || !prompt.trim()}
                className={`
                  w-full px-10 py-6 rounded-3xl font-bold text-xl transition-all duration-500 shadow-2xl
                  ${loading || !prompt.trim() 
                    ? 'bg-gray-500/30 text-white/50 cursor-not-allowed backdrop-blur-sm' 
                    : 'bg-gradient-to-r from-white/25 to-white/15 hover:from-white/35 hover:to-white/25 text-white backdrop-blur-sm border border-white/30 hover:scale-[1.02] hover:shadow-3xl transform'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-7 h-7 border-3 border-white/40 border-t-white rounded-full animate-spin ml-4"></div>
                    <Zap className="w-6 h-6 ml-2 animate-pulse" />
                    יוצר תמונה מדהימה...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-6 h-6 ml-2" />
                    צור תמונה עכשיו
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-12 pb-6">
              <div className="max-w-3xl mx-auto">
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl px-6 py-4 text-red-100 shadow-xl">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full ml-3"></div>
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Result */}
          {imageUrl && (
            <div className="px-12 pb-12">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                      <img 
                        src={imageUrl} 
                        alt="תמונה שנוצרה" 
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                        <button
                          onClick={handleDownloadImage}
                          className="bg-white/20 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-3 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 shadow-xl"
                        >
                          <Download className="w-5 h-5 text-white" />
                          <span className="text-white font-semibold">הורד תמונה</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-1">התמונה שלך מוכנה! 🎨</h3>
                      <p className="text-white/70 font-medium">לחץ על כפתור ההורדה לשמירה</p>
                    </div>
                    <button
                      onClick={handleDownloadImage}
                      className="bg-gradient-to-r from-cyan-400/80 to-blue-500/80 hover:from-cyan-500/90 hover:to-blue-600/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:scale-105 border border-white/20"
                    >
                      <Download className="w-6 h-6" />
                      <span>הורד עכשיו</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/20 shadow-xl inline-block">
            <p className="text-white/90 font-semibold text-lg">
              ✨ מופעל על ידי בינה מלאכותית מתקדמת • יצירה מהירה ואיכותית ✨
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ImageGenerator;