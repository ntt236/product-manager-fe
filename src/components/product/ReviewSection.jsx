import { Star } from 'lucide-react';

export default function ReviewSection({
  reviews,
  avgRating,
  reviewCount,
  loadingReviews,
  isAuthenticated,
  newRating,
  setNewRating,
  newComment,
  setNewComment,
  submittingReview,
  onSubmitReview,
}) {
  return (
    <div className="mt-20 pt-10 border-t border-neutral-800 space-y-10">
      <div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2.5">
          Đánh giá từ khách hàng ({reviewCount})
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Phản hồi thực tế từ những người đã trải nghiệm sản phẩm này.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {loadingReviews ? (
            <div className="text-xs text-neutral-400">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="p-8 rounded-xl border border-neutral-800 bg-neutral-900/40 text-center text-neutral-400 text-sm">
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên để lại nhận xét!
            </div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-200">
                      {r.user_name || 'Khách hàng'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(r.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{r.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Box */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-4 h-fit">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Gửi đánh giá của bạn
          </h3>

          {isAuthenticated ? (
            <form onSubmit={onSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                  Đánh giá sao:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewRating(s)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= newRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-700 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                  Nhận xét chi tiết:
                </label>
                <textarea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chất liệu, phom dáng và trải nghiệm..."
                  className="input-minimal text-xs resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full btn-primary !py-2.5 text-xs"
              >
                {submittingReview ? 'Đang gửi...' : 'Gửi nhận xét'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-3">
              <p className="text-xs text-neutral-400">
                Vui lòng đăng nhập để gửi đánh giá sản phẩm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

