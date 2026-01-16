export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>FoodPass MVP • Algorand TestNet</div>
          <div className="text-xs">No personal data stored • Wallet addresses only</div>
        </div>
      </div>
    </footer>
  )
}
