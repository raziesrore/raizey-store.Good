'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase';

// بيانات باقات الألعاب التجريبية
const GAMES_DATA = [
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    tag: 'شدات ببجي',
    price: '4,500 ج.س',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    placeholder: 'أدخل معرف اللاعب (ID) الخاص بك'
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    tag: 'جواهر فري فاير',
    price: '3,200 ج.س',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=400&q=80',
    placeholder: 'أدخل معرف اللاعب (ID) الخاص بك'
  },
  {
    id: 'pes',
    name: 'eFootball PES',
    tag: 'كوينز بيس',
    price: '5,000 ج.س',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    placeholder: 'أدخل معرف اللاعب (ID) الخاص بك'
  }
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerIds, setPlayerIds] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول وجلب الرصيد
    const checkUserAndWallet = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // جلب رصيد المحفظة من جدول wallets
        const { data: walletData, error } = await supabase
          .from('wallets')
          .select('balance_sdg')
          .eq('id', user.id)
          .single();
        
        if (!error && walletData) {
          setBalance(walletData.balance_sdg);
        } else {
          setBalance(0); // إذا لم يجد محفظة يضع الرصيد صفر مؤقتاً
        }
      }
      setLoading(false);
    };

    checkUserAndWallet();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBalance(null);
    router.refresh();
  };

  const handleInputChange = (gameId: string, value: string) => {
    setPlayerIds(prev => ({ ...prev, [gameId]: value }));
  };

  const handleOrder = (gameName: string, gameId: string) => {
    const id = playerIds[gameId];
    if (!user) {
      alert('الرجاء تسجيل الدخول أولاً لتتمكن من الشحن!');
      router.push('/login');
      return;
    }
    if (!id || id.trim() === '') {
      alert('الرجاء إدخال الـ ID الخاص بك أولاً!');
      return;
    }
    alert(`تم استلام طلبك لشحن ${gameName} للـ ID: ${id}. جاري معالجة الطلب من المحفظة!`);
  };

  return (
    <div className="min-h-screen bg-[#21006F] text-white font-sans pb-12">
      
      {/* الهيدر العلوي */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <Link href="/" className="text-xl font-black tracking-wider text-[#FFB800]">
            RAIZ3Y STORE
          </Link>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="text-xs text-white/50 bg-black/30 px-4 py-2 rounded-full border border-white/5">جاري التحميل...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="bg-black/40 border border-[#FFB800]/30 px-4 py-1.5 rounded-full text-xs text-center">
                  <span className="text-[#FFB800] font-bold">المحفظة: </span>
                  <span>{balance !== null ? balance.toLocaleString() : 0} ج.س</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors"
                >
                  خروج
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-xs bg-[#FFB800] text-black font-bold px-5 py-2 rounded-lg transition-all active:scale-95 shadow-[0_4px_10px_rgba(255,184,0,0.2)] hover:bg-[#e6a500]"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* البانر الترحيبي العريض */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-gradient-to-r from-black/40 to-black/10 border border-white/10 rounded-3xl p-8 text-center md:text-right relative overflow-hidden mb-12 shadow-xl">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
              شحن ذكي، آمن، وبسرعة صاروخية
            </h2>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed">
              المنصة الرسمية لتلبية طلبات مجتمع الألعاب الكبرى في السودان بأسعار ديناميكية مباشرة ودعم كامل للدفع بالمحفظة الرقمية.
            </p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,184,0,0.1),transparent_45%)]"></div>
        </div>

        {/* قسم كروت الألعاب */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GAMES_DATA.map((game) => (
            <div 
              key={game.id} 
              className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-[#FFB800]/40 flex flex-col"
            >
              <div className="h-44 relative bg-gray-900 overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 right-3 bg-[#FFB800] text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md">
                  {game.tag}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-white text-right mb-1">{game.name}</h3>
                  <p className="text-[#FFB800] font-bold text-sm text-right mb-4">{game.price}</p>
                  
                  <div className="space-y-1">
                    <input
                      type="text"
                      dir="rtl"
                      placeholder={game.placeholder}
                      value={playerIds[game.id] || ''}
                      onChange={(e) => handleInputChange(game.id, e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-center text-white placeholder-white/40 focus:outline-none focus:border-[#FFB800] transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleOrder(game.name, game.id)}
                  className="w-full bg-[#FFB800] text-black font-bold py-3 rounded-xl text-xs mt-5 transition-all active:scale-95 shadow-[0_4px_12px_rgba(255,184,0,0.15)] hover:bg-[#e6a500]"
                >
                  شحن فوري
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
