export default function DetailPageHeader({name, category}) {
  return (
    <div className="w-full max-w-6xl mx-auto  py-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <p className="mt-1 text-sm text-gray-500">{category}</p>
        </div>
      </header>
    </div>
  );
}
