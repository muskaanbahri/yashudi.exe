import { createContext, useContext, useEffect, useState } from "react";
import { fetchReviews, upsertReview } from "../api/reviewsApi";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReviews = async () => {
        setLoading(true);
        const data = await fetchReviews();
        setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const addReview = async (review) => {
        await upsertReview(review);
        await loadReviews(); // 🔑 this is the key fix
    };

    return (
        <ReviewsContext.Provider value={{ reviews, loading, addReview }}>
            {children}
        </ReviewsContext.Provider>
    );
}

export function useReviews() {
    const ctx = useContext(ReviewsContext);
    if (!ctx) {
        throw new Error("useReviews must be used inside ReviewsProvider");
    }
    return ctx;
}
