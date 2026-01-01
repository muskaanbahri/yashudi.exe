const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

export async function fetchReviews() {
  const res = await fetch(`${API_BASE}/reviews`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

export async function upsertReview(review) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_SECRET}`,
    },
    body: JSON.stringify(review),
  });

  if (!res.ok) throw new Error("Failed to save review");
  return res.json();
}
