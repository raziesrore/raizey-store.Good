'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // إنشاء حساب جديد في سوبابيز
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setMessage('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setIsSignUp(false);
      } else {
        // تسجيل الدخول
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setMessage(err.message || 'حدث خطأ ما، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#21006F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-wider text-[#FFB800] mb-2">RAIZ3Y STORE</h1>
          <p className="text-white/60 text-xs">
            {isSignUp ? 'أنشئ حسابك الآن للانضمام إلى منصة الشحن الذكية' : 'سجل دخولك لإدارة محفظتك وشحن ألعابك فوراً'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs text-white/70 mb-1 text-right">الاسم الكامل</label>
              <input
                type="text"
                required
                placeholder="أدخل اسمك الحقيقي"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-center focus:outline-none focus:border-[#FFB800] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-white/70 mb-1 text-right">البريد الإلكتروني</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-center focus:outline-none focus:border-[#FFB800] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1 text-right">كلمة المرور</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-center focus:outline-none focus:border-[#FFB800] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFB800] text-black font-bold py-3 rounded-lg text-sm mt-4 transition-all active:scale-95 shadow-[0_4px_15px_rgba(255,184,0,0.2)] hover:bg-[#e6a500] disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-black/40 border border-[#FFB800]/20 rounded-lg text-xs text-center text-[#FFB800]">
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-xs">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#FFB800] hover:underline focus:outline-none"
          >
            {isSignUp ? 'تمتلك حساباً بالفعل؟ سجل دخولك هنا' : 'لا تمتلك حساباً؟ اضغط هنا لإنشاء حساب جديد'}
          </button>
        </div>

      </div>
    </div>
  );
}
