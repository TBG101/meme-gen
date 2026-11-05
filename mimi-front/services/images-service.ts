export type imageResponse = {
    id: string;
    url: string;
    width: number;
    height: number;
    createdAt: string;
};

export type findAllImageResponse = {
    images: imageResponse[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/images";

export const imagesService = {
    getAll: async (
        limit: number = 10,
        page: number = 1
    ): Promise<findAllImageResponse> => {
        const params = new URLSearchParams({
            limit: String(limit),
            page: String(page),
        });

        const response = await fetch(`${BASE_URL}?${params}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }

        return response.json();
    },

    createImage: async (data: FormData): Promise<imageResponse> => {
        const response = await fetch(BASE_URL, {
            method: "POST",
            body: data,
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }
        return response.json()
    },
};