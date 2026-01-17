// Format reponse
export function makeResponse(props) {
    const { result, retCode, retMsg, status } = props;
    if (retCode) {
        return {
            result,
            retCode: retCode ?? '',
            retMsg: retMsg ?? '',
            status: status ?? 0,
            timeZone: Intl.DateTimeFormat()
                .resolvedOptions().timeZone
        };
    }
    return { result };
}
