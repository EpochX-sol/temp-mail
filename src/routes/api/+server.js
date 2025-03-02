import { error } from '@sveltejs/kit';

export async function GET({ url }) {
    try {
        // Some API operation
        const data = await fetchData();
        
        if (!data) {
            throw error(404, "Data not found");
        }
        
        return new Response(JSON.stringify(data));
    } catch (err) {
        // If it's not a 404, it's probably a server error
        if (err.status !== 404) {
            throw error(500, "Failed to process request");
        }
        throw err;
    }
} 