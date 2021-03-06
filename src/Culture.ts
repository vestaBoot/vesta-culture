import { DateTime, IDateTime } from "./DateTime";
import { Dictionary, IVocabs } from "./Dictionary";
import { ILocale } from "./Locale";

interface ICultureItem {
    dateTime: IDateTime;
    dictionary: Dictionary;
    locale: ILocale;
}

interface ICultureCollection {
    [localeName: string]: ICultureItem;
}

export interface ICulture {
    getCode: () => string;
    getDateTime: (code?: string) => IDateTime;
    getDateTimeInstance: (code?: string) => DateTime;
    getDictionary: (code?: string) => Dictionary;
    getLocale: (code?: string) => ILocale;
    register: (locale: ILocale, vocabs: IVocabs, dateTime: IDateTime) => void;
    setDefault: (locale: string) => void;
}

export class Culture {

    public static getCode(): string {
        return Culture.defaultCode;
    }

    public static getDateTime(code?: string): IDateTime {
        const culture = Culture.cultures[code || Culture.defaultCode];
        return culture ? culture.dateTime : Culture.cultures[Culture.defaultCode].dateTime;
    }

    public static getDateTimeInstance(code?: string): DateTime {
        const dateTime = Culture.getDateTime(code);
        return new dateTime();
    }

    public static getDictionary(code?: string): Dictionary {
        const culture = Culture.cultures[code || Culture.defaultCode];
        return culture ? culture.dictionary : Culture.cultures[Culture.defaultCode].dictionary;
    }

    public static getLocale(code?: string): ILocale {
        const culture = Culture.cultures[code || Culture.defaultCode];
        return culture ? culture.locale : Culture.cultures[Culture.defaultCode].locale;
    }

    public static register(locale: ILocale, vocabs: IVocabs, dateTime: IDateTime) {
        const code = locale.code;
        if (!Culture.defaultCode) {
            Culture.setDefault(code);
        }
        const dictionary = new Dictionary();
        dictionary.inject(vocabs);
        Culture.cultures[code] = { locale, dictionary, dateTime };
    }

    public static setDefault(locale: string) {
        Culture.defaultCode = locale;
    }

    private static cultures: ICultureCollection = {};
    private static defaultCode: string;
}
