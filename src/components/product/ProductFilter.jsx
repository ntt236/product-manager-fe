import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

export default function ProductFilter({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedSize,
  onSizeChange,
  selectedSort,
  onSortChange,
  onReset,
}) {
  // Prefer fashion categories for consumer display
  const fashionCategories = categories.filter((c) => {
    const name = c.name.toLowerCase();
    return !['electronics', 'home & kitchen', 'books'].includes(name);
  });

  const displayCategories = fashionCategories.length > 0 ? fashionCategories : categories;

  return (
    <div className="space-y-4 border-b border-neutral-800 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên sản phẩm..."
            className="input-minimal pl-10 pr-9 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 p-0.5 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category & Sort controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Select */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 absolute left-3 text-neutral-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="input-minimal pl-9 pr-8 text-xs uppercase tracking-wider bg-neutral-900 border-neutral-800 appearance-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {displayCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-neutral-400 pointer-events-none" />
            <select
              value={selectedSort || 'newest'}
              onChange={(e) => onSortChange(e.target.value)}
              className="input-minimal pl-9 pr-8 text-xs uppercase tracking-wider bg-neutral-900 border-neutral-800 appearance-none cursor-pointer"
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="price_asc">Giá: Thấp &rarr; Cao</option>
              <option value="price_desc">Giá: Cao &rarr; Thấp</option>
            </select>
          </div>

          {(search || selectedCategory || selectedSize || (selectedSort && selectedSort !== 'newest')) && (
            <button
              type="button"
              onClick={onReset}
              className="btn-secondary !py-2 text-[11px] whitespace-nowrap"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Quick Size Filter Pills */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {/* <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono mr-1">
          Lọc kích cỡ:
        </span>
        <button
          type="button"
          onClick={() => onSizeChange('')}
          className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition ${!selectedSize
              ? 'border-white bg-neutral-800 text-white font-bold'
              : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
            }`}
        >
          Tất cả
        </button>
        {POPULAR_SIZES.map((sz) => (
          <button
            key={sz}
            type="button"
            onClick={() => onSizeChange(selectedSize === sz ? '' : sz)}
            className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition ${selectedSize === sz
                ? 'border-white bg-white text-neutral-950 font-bold shadow-sm'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
              }`}
          >
            {sz}
          </button>
        ))} */}
      </div>
    </div>
  );
}
