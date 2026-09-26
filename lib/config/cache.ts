import { cacheLife, cacheTag, updateTag } from "next/cache";

export const setCache = (tag: string, update: boolean = false) => {
    cacheLife("hours");
    cacheTag(tag);

    if (update)
        updateTag(tag);
}