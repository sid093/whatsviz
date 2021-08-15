export function colorHasher(sValue) {
    if (sValue) {
        let r = 0, g = 0, b = 0;
        for (let i in sValue) {
            let code = sValue.charCodeAt(i);
            if (code % 2 === 0) {
                r += code;
            } else if (code % 3 === 0) {
                g += code;
            } else {
                b += code;
            }
        }
        r %= 254;
        g %= 254;
        b %= 254;
        return `rgba(${r},${g},${b},1)`;
    } else {
        return "rgba(50,50,200,.7)";
    }
}

export const DEVICE_PIXEL_RATIO = 1.5;