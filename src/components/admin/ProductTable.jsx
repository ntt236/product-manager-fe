import { Edit2, Trash2, Layers } from 'lucide-react';

export default function ProductTable({
  products,
  pagination,
  onEdit,
  onDelete,
  onManageVariants,
  onPageChange,
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-900/90 text-[10px] font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-800">
          <tr>
            <th className="px-5 py-3">Sản phẩm</th>
            <th className="px-5 py-3">Danh mục</th>
            <th className="px-5 py-3">Đơn giá</th>
            <th className="px-5 py-3">Biến thể (Size/Màu)</th>
            <th className="px-5 py-3">Tồn kho</th>
            <th className="px-5 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60 font-mono">
          {products.map((p) => {
            const hasVariants =
              (p.available_sizes && p.available_sizes.length > 0) ||
              parseInt(p.variant_count, 10) > 0;
            const totalStock = hasVariants
              ? Math.max(parseInt(p.stock_quantity, 10) || 0, parseInt(p.total_variant_stock, 10) || 0)
              : (parseInt(p.stock_quantity, 10) || 0);

            return (
              <tr key={p.id} className="hover:bg-neutral-900/90 transition">
                <td className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-10 h-12 rounded bg-neutral-800 overflow-hidden flex-shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-neutral-500">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 font-sans">
                    <h4 className="text-sm font-medium text-neutral-200 truncate">{p.name}</h4>
                    <span className="text-[10px] text-neutral-400 font-mono">ID: #{p.id}</span>
                  </div>
                </td>

                <td className="px-5 py-3.5 font-sans">
                  <span className="badge-minimal bg-neutral-800 text-neutral-300 border-neutral-700">
                    {p.category_name || '—'}
                  </span>
                </td>

                <td className="px-5 py-3.5 text-neutral-200 font-medium">
                  {Number(p.price).toLocaleString('vi-VN')} ₫
                </td>

                {/* Variants Column */}
                <td className="px-5 py-3.5 font-sans">
                  {p.available_sizes && p.available_sizes.length > 0 ? (
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {p.available_sizes.slice(0, 4).map((sz) => (
                          <span
                            key={sz}
                            className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[10px] font-mono text-neutral-300"
                          >
                            {sz}
                          </span>
                        ))}
                        {p.available_sizes.length > 4 && (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            +{p.available_sizes.length - 4}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block font-mono">
                        {p.variant_count || p.available_sizes.length} phân loại
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-500 text-[11px]">Chưa tạo</span>
                  )}
                </td>

                <td className="px-5 py-3.5">
                  <span
                    className={`badge-minimal ${
                      totalStock > 0
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950/60 text-rose-300 border-rose-800'
                    }`}
                  >
                    {totalStock} cái
                  </span>
                </td>

                <td className="px-5 py-3.5 text-right font-sans space-x-1.5 whitespace-nowrap">
                  <button
                    onClick={() => onManageVariants(p)}
                    className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 transition inline-flex items-center gap-1 text-[11px]"
                    title="Quản lý biến thể size & màu"
                  >
                    <Layers className="w-3.5 h-3.5" /> Biến thể
                  </button>
                  <button
                    onClick={() => onEdit(p)}
                    className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white transition inline-flex items-center gap-1 text-[11px]"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Sửa
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="p-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/50 text-rose-400 hover:text-rose-300 transition inline-flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-800 bg-neutral-900/40 text-xs">
          <span className="text-neutral-400 font-mono">
            Trang {pagination.page} / {pagination.totalPages} ({pagination.total} sản phẩm)
          </span>
          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              className="btn-secondary !py-1 text-xs"
            >
              ← Trước
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              className="btn-secondary !py-1 text-xs"
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
