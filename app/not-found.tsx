import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-black text-[#e50914]">404</p>
      <h1 className="mt-3 text-3xl font-black">الصفحة غير موجودة</h1>
      <Link href="/" className="btn-light mt-6 inline-flex px-5 py-2.5 text-sm">
        العودة للرئيسية
      </Link>
    </div>
  );
}
