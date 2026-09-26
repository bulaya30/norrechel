import { settingService } from "@/lib/container/setting.container";
import { success, failure, type Params } from "@/lib/api/response";

export async function GET(req: Request, { params }: Params) {
    try {
        const body = await req.json();
        const uid = body.uid;
        await settingService.resetSetting(uid);
        return success({sucess: true});
    } catch (error) {
        return failure(error);
    }
}