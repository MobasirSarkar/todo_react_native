export const RES_JSON = <T = unknown>(
    message: string,
    success: boolean,
    status_code: number,
    data: T = null as T,
) => {
    return {
        message: message,
        success: success,
        status_code: status_code,
        data,
    };
};
