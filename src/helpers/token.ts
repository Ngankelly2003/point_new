import dayjs from "dayjs";

export const isExpired = (time: any): boolean => {
    const endTime = dayjs(time)
    const now = dayjs(new Date())
    return endTime.isBefore(now);
}

export const refreshToken = async (token: string, refreshToken: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/token/refresh`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({accessToken: token, refreshToken}),
        });

        return await response.json();
    } catch (err) {
        return false;
    }
}