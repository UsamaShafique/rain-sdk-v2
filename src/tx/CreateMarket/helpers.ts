import { CreateMarketTxParams } from "../types.js";

export function normalizeBarValues(values: (number)[]): number[] {
    const transformedBarValues = [
        ...values.map((value) => Math.floor(value * 100)),
    ];
    const totalRounded = transformedBarValues.reduce(
        (sum, val) => sum + val,
        0
    );
    const difference = 10000 - totalRounded;
    if (difference !== 0) {
        transformedBarValues[transformedBarValues.length - 1] += difference;
    }

    return transformedBarValues
}

export async function uploadMetaData(
    params: CreateMarketTxParams
): Promise<string> {
    const {
        marketQuestion,
        marketOptions,
        marketTags,
        marketDescription,
        isPublic,
        isPublicPoolResolverAi,
        startTime,
        endTime,
        no_of_options,
        creator,
        tradingModel,
        apiUrl,
    } = params;

    const formattedStartDate = new Date(Number(startTime) * 1000).toISOString();
    const formattedEndDate = new Date(Number(endTime) * 1000).toISOString();

    const metadata = {
        question: marketQuestion,
        isPrivate: !isPublic,
        options: Array.isArray(marketOptions) ? marketOptions : [],
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        tradingModel: tradingModel ?? 0,
        questionImage: params.questionImage ?? '',
        tags: marketTags,
        poolDescription: marketDescription,
        isAiResolver: isPublicPoolResolverAi,
    };
    const res = await fetch(`${apiUrl}/ipfs/upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(apiUrl?.includes('ngrok') ? { "ngrok-skip-browser-warning": "true" } : {}),
        },
        body: JSON.stringify(metadata),
    });
    if (!res.ok) {
        const errorText = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to upload metadata: ${res.status} — ${errorText}`);
    }
    const data = await res.json();
    return data?.data?.ipfsHash;
}
