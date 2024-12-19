import { useEffect, useState } from "react"
import { fetchAllRestaurants } from "../utils/api";
import { Restaurant } from "../type";

export const useFetchAllRestaurants = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const result = await fetchAllRestaurants();
            setRestaurants(result)
            setLoading(false);
        }
        fetchRestaurants();
    }, [])

    return {
        restaurants, loading
    }
}